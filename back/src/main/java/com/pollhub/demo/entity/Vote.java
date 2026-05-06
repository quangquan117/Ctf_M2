package com.pollhub.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "votes")
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vote")
    private Long idVote;

    @Column(name = "date_vote", nullable = false)
    private LocalDateTime dateVote;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_utilisateur")
    private Utilisateur utilisateur;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_option")
    private Option option;

    public Long getIdVote() {
        return idVote;
    }

    public void setIdVote(Long idVote) {
        this.idVote = idVote;
    }

    public LocalDateTime getDateVote() {
        return dateVote;
    }

    public void setDateVote(LocalDateTime dateVote) {
        this.dateVote = dateVote;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Option getOption() {
        return option;
    }

    public void setOption(Option option) {
        this.option = option;
    }
}
