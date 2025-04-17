<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250407092348 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE patient ADD antecedents LONGTEXT DEFAULT NULL, DROP medicament, DROP allergie, DROP maladie, DROP antecendent_chirurgicaux');
        $this->addSql('ALTER TABLE photo ADD updated_at DATETIME DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE patient ADD allergie VARCHAR(255) DEFAULT NULL, ADD maladie VARCHAR(255) DEFAULT NULL, ADD antecendent_chirurgicaux LONGTEXT DEFAULT NULL, CHANGE antecedents medicament LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE photo DROP updated_at');
    }
}
