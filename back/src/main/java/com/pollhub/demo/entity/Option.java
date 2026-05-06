package com.pollhub.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "options")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_option")
    private Long idOption;

    @Column(nullable = false)
    private String texte;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_sondage")
    private Sondage sondage;

    @OneToMany(mappedBy = "option")
    private List<Vote> votes = new ArrayList<>();

    public Long getIdOption() {
        return idOption;
    }

    public void setIdOption(Long idOption) {
        this.idOption = idOption;
    }

    public String getTexte() {
        return texte;
    }

    public void setTexte(String texte) {
        this.texte = texte;
    }

    public Sondage getSondage() {
        return sondage;
    }

    public void setSondage(Sondage sondage) {
        this.sondage = sondage;
    }

    public List<Vote> getVotes() {
        return votes;
    }

    public void setVotes(List<Vote> votes) {
        this.votes = votes;
    }
}
