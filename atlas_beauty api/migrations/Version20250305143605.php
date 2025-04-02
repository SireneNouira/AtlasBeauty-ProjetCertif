<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250305143605 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE patient (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, civilite VARCHAR(255) NOT NULL, annee_naissance DATETIME NOT NULL, adress VARCHAR(255) DEFAULT NULL, code_postal BIGINT DEFAULT NULL, ville VARCHAR(255) DEFAULT NULL, pays VARCHAR(255) NOT NULL, profession VARCHAR(255) NOT NULL, tel VARCHAR(255) NOT NULL, poids BIGINT NOT NULL, taille BIGINT NOT NULL, tabac TINYINT(1) NOT NULL, alcool TINYINT(1) NOT NULL, medicament LONGTEXT DEFAULT NULL, allergie VARCHAR(255) DEFAULT NULL, maladie VARCHAR(255) DEFAULT NULL, antecendent_chirurgicaux LONGTEXT DEFAULT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE patient');
    }
}
