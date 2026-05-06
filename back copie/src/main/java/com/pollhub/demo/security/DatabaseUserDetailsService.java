package com.pollhub.demo.security;

import com.pollhub.demo.repository.UtilisateurRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    public DatabaseUserDetailsService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return utilisateurRepository.findByEmail(username)
            .map(user -> User.withUsername(user.getEmail())
                .password(user.getMotDePasse())
                .roles("USER")
                .build())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
