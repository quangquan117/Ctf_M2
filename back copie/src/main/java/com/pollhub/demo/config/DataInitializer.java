package com.pollhub.demo.config;

import com.pollhub.demo.entity.Utilisateur;
import com.pollhub.demo.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initBasicAccount(
        UtilisateurRepository utilisateurRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            String email = "admin@pollhub.local";
            if (utilisateurRepository.existsByEmail(email)) {
                return;
            }

            Utilisateur user = new Utilisateur();
            user.setNom("Admin");
            user.setEmail(email);
            user.setMotDePasse(passwordEncoder.encode("admin123"));
            utilisateurRepository.save(user);
        };
    }
}
