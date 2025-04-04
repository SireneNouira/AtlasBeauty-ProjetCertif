<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\DemandeDevisRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DemandeDevisRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ['demande_devis:read']],
denormalizationContext: ['groups' => ['demande_devis:write']],
operations: [
    new Get(
        security: "is_granted('DEMANDE_DEVIS_VIEW', object)"
    ),
    new GetCollection(
        security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_ASSISTANT')"
    ),
    new Post(
        security: "is_granted('DEMANDE_DEVIS_CREATE')",
        securityMessage: "Vous avez déjà une demande de devis en cours. Supprimez-la avant d'en créer une nouvelle.",
        inputFormats: ['multipart' => ['multipart/form-data'], 'json' => ['application/json']]
    ),
    new Put(
        security: "is_granted('DEMANDE_DEVIS_EDIT', object)",
        securityMessage: "Vous ne pouvez pas modifier cette demande de devis."
    ),
    new Delete(
        security: "is_granted('DEMANDE_DEVIS_DELETE', object)",
        securityMessage: "Vous ne pouvez pas supprimer cette demande de devis."
    )
])]
class DemandeDevis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'demandeDevis')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Patient $patient = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['demande_devis:write', 'demande_devis:read'])]
    private ?string $note = null;

    #[ORM\Column(type: "date", nullable: true)]
    #[Groups(['demande_devis:write', 'demande_devis:read'])]
    private ?\DateTimeInterface $date_souhaite = null;

    #[ORM\Column(length: 255)]
    private ?string $status = 'envoyé';

    #[ORM\OneToOne(mappedBy: 'demande_devis', cascade: ['persist', 'remove'])]
    private ?Devis $devis = null;

    #[ORM\ManyToOne(inversedBy: 'demandeDevis')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['demande_devis:read','demande_devis:write'])]
    private ?Intervention $intervention_1 = null;

    #[ORM\ManyToOne(inversedBy: 'demandeDevis')]
    #[Groups(['demande_devis:write', 'demande_devis:read'])]
    private ?Intervention $intervention_2 = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date_creation = null;
    
    public function __construct()
    {
        $this->date_creation = new \DateTime();
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateCreation(): ?\DateTimeInterface
    {
        return $this->date_creation;
    }
    public function setDateCreation(): ?\DateTimeInterface
    {
        return $this->date_creation;
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

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function setNote(?string $note): static
    {
        $this->note = $note;

        return $this;
    }

    public function getDateSouhaite(): ?\DateTimeInterface
    {
        return $this->date_souhaite;
    }

    public function setDateSouhaite(\DateTimeInterface $date_souhaite): static
    {
        $this->date_souhaite = $date_souhaite;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getDevis(): ?Devis
    {
        return $this->devis;
    }

    public function setDevis(?Devis $devis): static
    {
        // unset the owning side of the relation if necessary
        if ($devis === null && $this->devis !== null) {
            $this->devis->setDemandeDevis(null);
        }

        // set the owning side of the relation if necessary
        if ($devis !== null && $devis->getDemandeDevis() !== $this) {
            $devis->setDemandeDevis($this);
        }

        $this->devis = $devis;

        return $this;
    }

    public function getIntervention1(): ?Intervention
    {
        return $this->intervention_1;
    }

    public function setIntervention1(?Intervention $intervention_1): static
    {
        $this->intervention_1 = $intervention_1;

        return $this;
    }

    public function getIntervention2(): ?Intervention
    {
        return $this->intervention_2;
    }

    public function setIntervention2(?Intervention $intervention_2): static
    {
        $this->intervention_2 = $intervention_2;

        return $this;
    }


}
