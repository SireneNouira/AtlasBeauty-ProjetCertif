<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250226131310 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE etat (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE book ADD etat_id INT NOT NULL');
        $this->addSql('ALTER TABLE book ADD CONSTRAINT FK_CBE5A331D5E86FF FOREIGN KEY (etat_id) REFERENCES etat (id)');
        $this->addSql('CREATE INDEX IDX_CBE5A331D5E86FF ON book (etat_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE book DROP FOREIGN KEY FK_CBE5A331D5E86FF');
        $this->addSql('DROP TABLE etat');
        $this->addSql('DROP INDEX IDX_CBE5A331D5E86FF ON book');
        $this->addSql('ALTER TABLE book DROP etat_id');
    }
}
