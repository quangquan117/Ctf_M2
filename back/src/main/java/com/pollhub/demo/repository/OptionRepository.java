package com.pollhub.demo.repository;

import com.pollhub.demo.entity.Option;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionRepository extends JpaRepository<Option, Long> {

    Optional<Option> findByIdOptionAndSondageIdSondage(Long idOption, Long idSondage);
}
