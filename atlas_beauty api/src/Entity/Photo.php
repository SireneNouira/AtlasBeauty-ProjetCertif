<?php
// src/Entity/Photo.php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[Vich\Uploadable]
#[ApiResource(
    normalizationContext: ['groups' => ['photo:read']],
    denormalizationContext: ['groups' => ['photo:write']]
)]
class Photo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups(['photo:read'])]
    private ?int $id = null;

    #[Vich\UploadableField(mapping: "patient_photo", fileNameProperty: "photoPath")]
    private ?File $photoFile = null;

    #[ORM\Column(type: "string", length: 255)]
    #[Groups(['photo:read'])]
    private ?string $photoPath = null;

    #[ORM\ManyToOne(targetEntity: Patient::class, inversedBy: "photos")]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['photo:read'])]
    private ?Patient $patient = null;

    #[ORM\Column(type: "datetime", nullable: true)]
    #[Groups(['photo:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setPhotoFile(?File $photoFile = null): void
    {
        $this->photoFile = $photoFile;

        if (null !== $photoFile) {
            // Pour que Doctrine détecte les changements quand le fichier change
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getPhotoFile(): ?File
    {
        return $this->photoFile;
    }
    
    public function getPhotoPath(): ?string
    {
        return $this->photoPath;
    }

    public function setPhotoPath(?string $photoPath): self
    {
        $this->photoPath = $photoPath;
        return $this;
    }

    public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(?Patient $patient): self
    {
        $this->patient = $patient;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
{
    return $this->updatedAt;
}

public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
{
    $this->updatedAt = $updatedAt;

    return $this;
}

}