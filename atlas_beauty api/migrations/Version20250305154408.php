<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250305154408 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE intervention (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE patient_intervention (patient_id INT NOT NULL, intervention_id INT NOT NULL, INDEX IDX_374B4B956B899279 (patient_id), INDEX IDX_374B4B958EAE3863 (intervention_id), PRIMARY KEY(patient_id, intervention_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE photo (id INT AUTO_INCREMENT NOT NULL, patient_id INT NOT NULL, photo_path VARCHAR(255) NOT NULL, INDEX IDX_14B784186B899279 (patient_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE patient_intervention ADD CONSTRAINT FK_374B4B956B899279 FOREIGN KEY (patient_id) REFERENCES patient (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE patient_intervention ADD CONSTRAINT FK_374B4B958EAE3863 FOREIGN KEY (intervention_id) REFERENCES intervention (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE photo ADD CONSTRAINT FK_14B784186B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE patient_intervention DROP FOREIGN KEY FK_374B4B956B899279');
        $this->addSql('ALTER TABLE patient_intervention DROP FOREIGN KEY FK_374B4B958EAE3863');
        $this->addSql('ALTER TABLE photo DROP FOREIGN KEY FK_14B784186B899279');
        $this->addSql('DROP TABLE intervention');
        $this->addSql('DROP TABLE patient_intervention');
        $this->addSql('DROP TABLE photo');
    }
}
