<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Repository\DevisRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use App\Dto\CreateDevisInput;

#[ORM\Entity(repositoryClass: DevisRepository::class)]
#[ApiResource(
    input: CreateDevisInput::class,
    normalizationContext: ['groups' => ['devis:read']],
    denormalizationContext: ['groups' => ['devis:write']],
    operations: [
        new GetCollection(),
        new Get(),
        new Post(inputFormats: ['multipart' => ['multipart/form-data']]),
    ]
)]
#[Vich\Uploadable]
class Devis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['devis:read'])]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'devis', cascade: ['persist', 'remove'])]
    #[Groups(['devis:read', 'devis:write'])]
    private ?Patient $patient = null;

    #[Vich\UploadableField(mapping: "devis_pdf", fileNameProperty: "fichier")]
    #[Groups(['devis:write'])]
    private ?\Symfony\Component\HttpFoundation\File\File $devisFile = null;

    #[ORM\Column(length: 255)]
    #[Groups(['devis:read', 'devis:write'])]
    private ?string $fichier = null;

    #[ORM\Column(type: "datetime", nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['devis:read', 'devis:write'])]
    private ?\DateTimeInterface $date_operation = null;

    #[ORM\Column]
    #[Groups(['devis:read', 'devis:write'])]
    private ?bool $is_signed = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['devis:read', 'devis:write'])]
    private ?\DateTimeInterface $date_sejour = null;

    #[ORM\OneToOne(inversedBy: 'devis', cascade: ['persist', 'remove'])]
    #[Groups(['devis:read', 'devis:write'])]
    private ?DemandeDevis $demande_devis = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(?Patient $patient): static
    {
        $this->patient = $patient;

        return $this;
    }

    public function getFichier(): ?string
    {
        return $this->fichier;
    }

    public function setFichier(string $fichier): static
    {
        $this->fichier = $fichier;

        return $this;
    }

    public function getDateOperation(): ?\DateTimeInterface
    {
        return $this->date_operation;
    }

    public function setDateOperation(\DateTimeInterface $date_operation): static
    {
        $this->date_operation = $date_operation;

        return $this;
    }

    public function isSigned(): ?bool
    {
        return $this->is_signed;
    }

    public function setIsSigned(bool $is_signed): static
    {
        $this->is_signed = $is_signed;

        return $this;
    }

    public function getDateSejour(): ?\DateTimeInterface
    {
        return $this->date_sejour;
    }

    public function setDateSejour(\DateTimeInterface $date_sejour): static
    {
        $this->date_sejour = $date_sejour;

        return $this;
    }

    public function getDemandeDevis(): ?DemandeDevis
    {
        return $this->demande_devis;
    }

    public function setDemandeDevis(?DemandeDevis $demande_devis): static
    {
        $this->demande_devis = $demande_devis;

        return $this;
    }

    public function setDevisFile(?File $file = null): void
    {
        $this->devisFile = $file;
        if ($file !== null) {
            $this->updatedAt = new \DateTime();
        }
    }

    public function getDevisFile(): ?File
    {
        return $this->devisFile;
    }

    // Ajoute getter/setter updatedAt si pas déjà présent
    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }
}
