<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250306090941 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE patient_intervention DROP FOREIGN KEY FK_374B4B956B899279');
        $this->addSql('ALTER TABLE patient_intervention DROP FOREIGN KEY FK_374B4B958EAE3863');
        $this->addSql('DROP TABLE patient_intervention');
        $this->addSql('ALTER TABLE demande_devis ADD intervention_1_id INT NOT NULL, ADD intervention_2_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE demande_devis ADD CONSTRAINT FK_7DF94602FF6C4438 FOREIGN KEY (intervention_1_id) REFERENCES intervention (id)');
        $this->addSql('ALTER TABLE demande_devis ADD CONSTRAINT FK_7DF94602EDD9EBD6 FOREIGN KEY (intervention_2_id) REFERENCES intervention (id)');
        $this->addSql('CREATE INDEX IDX_7DF94602FF6C4438 ON demande_devis (intervention_1_id)');
        $this->addSql('CREATE INDEX IDX_7DF94602EDD9EBD6 ON demande_devis (intervention_2_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE patient_intervention (patient_id INT NOT NULL, intervention_id INT NOT NULL, INDEX IDX_374B4B956B899279 (patient_id), INDEX IDX_374B4B958EAE3863 (intervention_id), PRIMARY KEY(patient_id, intervention_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE patient_intervention ADD CONSTRAINT FK_374B4B956B899279 FOREIGN KEY (patient_id) REFERENCES patient (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE patient_intervention ADD CONSTRAINT FK_374B4B958EAE3863 FOREIGN KEY (intervention_id) REFERENCES intervention (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE demande_devis DROP FOREIGN KEY FK_7DF94602FF6C4438');
        $this->addSql('ALTER TABLE demande_devis DROP FOREIGN KEY FK_7DF94602EDD9EBD6');
        $this->addSql('DROP INDEX IDX_7DF94602FF6C4438 ON demande_devis');
        $this->addSql('DROP INDEX IDX_7DF94602EDD9EBD6 ON demande_devis');
        $this->addSql('ALTER TABLE demande_devis DROP intervention_1_id, DROP intervention_2_id');
    }
}
