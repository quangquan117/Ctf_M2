-- PollHub schema initialisation (runs only on first container start)
-- Hibernate ddl-auto=update will also create/update tables, but this
-- guarantees the schema exists with correct charset & constraints.

CREATE DATABASE IF NOT EXISTS pollhub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pollhub;

CREATE TABLE IF NOT EXISTS utilisateurs (
    id_utilisateur BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom            VARCHAR(255)  NOT NULL,
    email          VARCHAR(255)  NOT NULL UNIQUE,
    mot_de_passe   VARCHAR(255)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sondages (
    id_sondage      BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre           VARCHAR(255)  NOT NULL,
    description     TEXT,
    date_creation   DATETIME      NOT NULL,
    lien_partage    VARCHAR(255)  UNIQUE,
    date_fermeture  DATETIME      NOT NULL,
    multi_reponse   BOOLEAN       NOT NULL DEFAULT FALSE,
    id_utilisateur  BIGINT        NOT NULL,
    CONSTRAINT fk_sondage_utilisateur
        FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS options (
    id_option   BIGINT AUTO_INCREMENT PRIMARY KEY,
    texte       VARCHAR(255) NOT NULL,
    id_sondage  BIGINT       NOT NULL,
    CONSTRAINT fk_option_sondage
        FOREIGN KEY (id_sondage) REFERENCES sondages(id_sondage)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS votes (
    id_vote         BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_vote       DATETIME NOT NULL,
    id_utilisateur  BIGINT   NOT NULL,
    id_option       BIGINT   NOT NULL,
    CONSTRAINT fk_vote_utilisateur
        FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur),
    CONSTRAINT fk_vote_option
        FOREIGN KEY (id_option) REFERENCES options(id_option)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
