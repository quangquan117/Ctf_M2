package com.pollhub.demo.auth;

import com.pollhub.demo.entity.Utilisateur;
import com.pollhub.demo.repository.UtilisateurRepository;
import com.pollhub.demo.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
        UtilisateurRepository utilisateurRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService
    ) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already used");
        }

        Utilisateur user = new Utilisateur();
        user.setNom(request.nom());
        user.setEmail(request.email());
        user.setMotDePasse(passwordEncoder.encode(request.motDePasse()));
        Utilisateur savedUser = utilisateurRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(toUserInfo(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.motDePasse())
        );
        Utilisateur user = utilisateurRepository.findByEmail(request.email()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(new LoginResponse(token, "Bearer", toUserInfo(user)));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Logout successful. Delete token on client side.");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Utilisateur user = utilisateurRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(toUserInfo(user));
    }

    private UserInfoResponse toUserInfo(Utilisateur user) {
        return new UserInfoResponse(user.getIdUtilisateur(), user.getNom(), user.getEmail());
    }

    public record RegisterRequest(
        String nom,
        String email,
        String motDePasse
    ) {}

    public record LoginRequest(
        String email,
        String motDePasse
    ) {}

    public record UserInfoResponse(
        Long id,
        String nom,
        String email
    ) {}

    public record LoginResponse(
        String accessToken,
        String tokenType,
        UserInfoResponse utilisateur
    ) {}
}
