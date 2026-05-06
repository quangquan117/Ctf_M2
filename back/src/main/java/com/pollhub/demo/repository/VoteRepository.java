package com.pollhub.demo.repository;

import com.pollhub.demo.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    boolean existsByUtilisateurIdUtilisateurAndOptionSondageIdSondage(Long idUtilisateur, Long idSondage);
}
