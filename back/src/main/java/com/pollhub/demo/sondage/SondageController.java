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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
        Utilisateur owner = getAuthenticatedUser(authentication);
        if (owner == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (request.dureeMinutes() == null || request.dureeMinutes() <= 0) {
            return ResponseEntity.badRequest().body("Duration must be greater than 0 minute");
        }
        if (request.options() == null) {
            return ResponseEntity.badRequest().body("A poll requires at least 2 options");
        }

        List<String> validOptions = request.options().stream()
            .filter(option -> option != null && !option.trim().isEmpty())
            .toList();
        if (validOptions.size() < 2) {
            return ResponseEntity.badRequest().body("A poll requires at least 2 non-empty options");
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
        for (String texteOption : validOptions) {
            Option option = new Option();
            option.setTexte(texteOption.trim());
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
        Utilisateur user = getAuthenticatedUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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

    @GetMapping
    public List<SondageResponse> getAllSondages() {
        return sondageRepository.findAll().stream()
            .map(this::toSondageResponse)
            .toList();
    }

    @GetMapping("/{lienPartage}")
    public ResponseEntity<?> getSondageByLink(@PathVariable String lienPartage) {
        Sondage sondage = sondageRepository.findByLienPartage(lienPartage).orElse(null);
        if (sondage == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Poll not found");
        }
        return ResponseEntity.ok(toSondageResponse(sondage));
    }

    @GetMapping("/{lienPartage}/resultats")
    public ResponseEntity<?> getSondageResults(@PathVariable String lienPartage) {
        Sondage sondage = sondageRepository.findByLienPartage(lienPartage).orElse(null);
        if (sondage == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Poll not found");
        }

        long totalVotes = voteRepository.countByOptionSondageIdSondage(sondage.getIdSondage());
        List<OptionResultResponse> options = sondage.getOptions().stream()
            .map(option -> {
                long votes = voteRepository.countByOptionIdOption(option.getIdOption());
                return new OptionResultResponse(option.getIdOption(), option.getTexte(), votes);
            })
            .toList();

        return ResponseEntity.ok(
            new SondageResultResponse(
                sondage.getIdSondage(),
                sondage.getTitre(),
                sondage.getLienPartage(),
                totalVotes,
                options
            )
        );
    }

    @DeleteMapping("/{lienPartage}")
    public ResponseEntity<?> deleteSondage(@PathVariable String lienPartage, Authentication authentication) {
        Utilisateur user = getAuthenticatedUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Sondage sondage = sondageRepository.findByLienPartage(lienPartage).orElse(null);
        if (sondage == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Poll not found");
        }
        if (!sondage.getUtilisateur().getIdUtilisateur().equals(user.getIdUtilisateur())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only the poll author can delete this poll");
        }

        sondageRepository.delete(sondage);
        return ResponseEntity.ok("Poll deleted");
    }

    private Utilisateur getAuthenticatedUser(Authentication authentication) {
        if (authentication == null) {
            return null;
        }
        return utilisateurRepository.findByEmail(authentication.getName()).orElse(null);
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

    public record SondageResultResponse(
        Long id,
        String titre,
        String lienPartage,
        long totalVotes,
        List<OptionResultResponse> options
    ) {}

    public record OptionResultResponse(
        Long id,
        String texte,
        long votes
    ) {}
}
