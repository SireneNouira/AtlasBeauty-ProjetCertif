<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250306084358 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE demande_devis (id INT AUTO_INCREMENT NOT NULL, patient_id INT NOT NULL, note LONGTEXT DEFAULT NULL, date_souhaite DATETIME NOT NULL, status VARCHAR(255) NOT NULL, INDEX IDX_7DF946026B899279 (patient_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE devis (id INT AUTO_INCREMENT NOT NULL, patient_id INT DEFAULT NULL, demande_devis_id INT DEFAULT NULL, fichier VARCHAR(255) NOT NULL, date_operation DATETIME NOT NULL, is_signed TINYINT(1) NOT NULL, date_sejour DATETIME NOT NULL, UNIQUE INDEX UNIQ_8B27C52B6B899279 (patient_id), UNIQUE INDEX UNIQ_8B27C52B787B318 (demande_devis_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE demande_devis ADD CONSTRAINT FK_7DF946026B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)');
        $this->addSql('ALTER TABLE devis ADD CONSTRAINT FK_8B27C52B6B899279 FOREIGN KEY (patient_id) REFERENCES patient (id)');
        $this->addSql('ALTER TABLE devis ADD CONSTRAINT FK_8B27C52B787B318 FOREIGN KEY (demande_devis_id) REFERENCES demande_devis (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE demande_devis DROP FOREIGN KEY FK_7DF946026B899279');
        $this->addSql('ALTER TABLE devis DROP FOREIGN KEY FK_8B27C52B6B899279');
        $this->addSql('ALTER TABLE devis DROP FOREIGN KEY FK_8B27C52B787B318');
        $this->addSql('DROP TABLE demande_devis');
        $this->addSql('DROP TABLE devis');
    }
}
