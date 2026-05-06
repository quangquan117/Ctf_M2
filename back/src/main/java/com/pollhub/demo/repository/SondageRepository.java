package com.pollhub.demo.repository;

import com.pollhub.demo.entity.Sondage;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SondageRepository extends JpaRepository<Sondage, Long> {

    Optional<Sondage> findByLienPartage(String lienPartage);
}
