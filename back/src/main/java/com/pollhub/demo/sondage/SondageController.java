package com.pollhub.demo.sondage;

import com.pollhub.demo.entity.Option;
import com.pollhub.demo.entity.Sondage;
import com.pollhub.demo.entity.Utilisateur;
import com.pollhub.demo.entity.Vote;
import com.pollhub.demo.repository.OptionRepository;
import com.pollhub.demo.repository.SondageRepository;
import com.pollhub.demo.repository.UtilisateurRepository;
import com.pollhub.demo.repository.VoteRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sondages")
public class SondageController {

    private final SondageRepository sondageRepository;
    private final OptionRepository optionRepository;
    private final VoteRepository voteRepository;
    private final UtilisateurRepository utilisateurRepository;

    public SondageController(
        SondageRepository sondageRepository,
        OptionRepository optionRepository,
        VoteRepository voteRepository,
        UtilisateurRepository utilisateurRepository
    ) {
        this.sondageRepository = sondageRepository;
        this.optionRepository = optionRepository;
        this.voteRepository = voteRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @PostMapping
    public ResponseEntity<?> createSondage(@RequestBody CreateSondageRequest request, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (request.options() == null || request.options().size() < 2) {
            return ResponseEntity.badRequest().body("A poll requires at least 2 options");
        }
        if (request.dureeMinutes() == null || request.dureeMinutes() <= 0) {
            return ResponseEntity.badRequest().body("Duration must be greater than 0 minute");
        }

        Utilisateur owner = utilisateurRepository.findByEmail(authentication.getName()).orElse(null);
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Sondage sondage = new Sondage();
        sondage.setTitre(request.titre());
        sondage.setDescription(request.description());
        LocalDateTime now = LocalDateTime.now();
        sondage.setDateCreation(now);
        sondage.setDateFermeture(now.plusMinutes(request.dureeMinutes()));
        sondage.setLienPartage(UUID.randomUUID().toString());
        sondage.setUtilisateur(owner);

        List<Option> options = new ArrayList<>();
        for (String texteOption : request.options()) {
            Option option = new Option();
            option.setTexte(texteOption);
            option.setSondage(sondage);
            options.add(option);
        }
        sondage.setOptions(options);

        Sondage saved = sondageRepository.save(sondage);
        return ResponseEntity.status(HttpStatus.CREATED).body(toSondageResponse(saved));
    }

    @PostMapping("/{lienPartage}/vote")
    public ResponseEntity<?> vote(
        @PathVariable String lienPartage,
        @RequestBody VoteRequest request,
        Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Utilisateur user = utilisateurRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Sondage sondage = sondageRepository.findByLienPartage(lienPartage).orElse(null);
        if (sondage == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Poll not found");
        }
        if (LocalDateTime.now().isAfter(sondage.getDateFermeture())) {
            return ResponseEntity.status(HttpStatus.GONE).body("Poll closed: this link is no longer available");
        }

        boolean alreadyVoted = voteRepository.existsByUtilisateurIdUtilisateurAndOptionSondageIdSondage(
            user.getIdUtilisateur(),
            sondage.getIdSondage()
        );
        if (alreadyVoted) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("You already voted on this poll");
        }

        Option option = optionRepository.findByIdOptionAndSondageIdSondage(request.idOption(), sondage.getIdSondage()).orElse(null);
        if (option == null) {
            return ResponseEntity.badRequest().body("Option does not belong to this poll");
        }

        Vote vote = new Vote();
        vote.setDateVote(LocalDateTime.now());
        vote.setUtilisateur(user);
        vote.setOption(option);
        voteRepository.save(vote);

        return ResponseEntity.status(HttpStatus.CREATED).body("Vote recorded");
    }

    private SondageResponse toSondageResponse(Sondage sondage) {
        List<SondageOptionResponse> options = sondage.getOptions().stream()
            .map(option -> new SondageOptionResponse(option.getIdOption(), option.getTexte()))
            .toList();

        return new SondageResponse(
            sondage.getIdSondage(),
            sondage.getTitre(),
            sondage.getDescription(),
            sondage.getLienPartage(),
            sondage.getDateFermeture(),
            options
        );
    }

    public record CreateSondageRequest(
        String titre,
        String description,
        Long dureeMinutes,
        List<String> options
    ) {}

    public record VoteRequest(Long idOption) {}

    public record SondageResponse(
        Long id,
        String titre,
        String description,
        String lienPartage,
        LocalDateTime dateFermeture,
        List<SondageOptionResponse> options
    ) {}

    public record SondageOptionResponse(Long id, String texte) {}
}
