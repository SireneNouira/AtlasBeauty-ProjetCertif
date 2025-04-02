<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\DataPersister\PatientDataPersister;
use App\Dto\PatientGlobalDto;
use App\Repository\PatientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;


#[ORM\Entity(repositoryClass: PatientRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ApiResource(
    normalizationContext: ['groups' => ['patient:read']],
    operations: [
        new Get(
            security: "is_granted('PATIENT_VIEW', object)"
        ),
        new GetCollection(
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Post(
            input: PatientGlobalDto::class,
            output: Patient::class,
            uriTemplate: '/register',
            denormalizationContext: ['groups' => ['patient:write']],
            validationContext: ['groups' => ['Default']],
            security: "is_granted('PUBLIC_ACCESS')",
            processor: PatientDataPersister::class,
            // inputFormats: ['multipart' => ['multipart/form-data'], 'json' => ['application/json']]
        ),
        new Put(
            security: "is_granted('PATIENT_EDIT', object)",
            denormalizationContext: ['groups' => ['patient:update']]
        ),
        new Delete(
            security: "is_granted('PATIENT_DELETE', object)"
        )
    ]
)]
class Patient implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column(type: 'json')]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(['patient:write', 'patient:update'])]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?string $prenom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?string $civilite = null;

    #[ORM\Column(type: "integer", nullable: true)]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?int $annee_naissance = null;

    #[Groups(['patient:write','patient:read', 'patient:update'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adress = null;

    #[Groups(['patient:write','patient:read', 'patient:update'])]
    #[ORM\Column(type: Types::BIGINT, nullable: true)]
    private ?string $code_postal = null;

    #[Groups(['patient:write','patient:read', 'patient:update'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $ville = null;

    #[ORM\Column(length: 255)]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?string $pays = null;

    #[ORM\Column(length: 255)]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?string $profession = null;

    #[ORM\Column(length: 255)]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?string $tel = null;

    #[ORM\Column(type: "decimal", precision: 5, scale: 2, nullable: true)]
    #[Groups(['patient:write'])]
    private ?float $poids = null;

    #[ORM\Column(type: "decimal", precision: 5, scale: 1, nullable: true)]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?float $taille = null;

    #[ORM\Column]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?bool $tabac = null;

    #[ORM\Column]
    #[Groups(['patient:write','patient:read', 'patient:update'])]
    private ?bool $alcool = null;

    #[Groups(['patient:write','patient:read', 'patient:update'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $medicament = null;

    #[Groups(['patient:write','patient:read', 'patient:update'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $allergie = null;

    #[Groups(['patient:write','patient:read', 'patient:update'])]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $maladie = null;

    #[Groups(['patient:write','patient:read', 'patient:update'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $antecendent_chirurgicaux = null;

    #[ORM\OneToMany(mappedBy: "patient", targetEntity: Photo::class, cascade: ["persist", "remove"])]
    private Collection $photos;
  

    
    /**
     * @var Collection<int, DemandeDevis>
     */
    #[ORM\OneToMany(targetEntity: DemandeDevis::class, mappedBy: 'patient')]
    private Collection $demandeDevis;

    #[ORM\OneToOne(mappedBy: 'patient', cascade: ['persist', 'remove'])]
    private ?Devis $devis = null;

    public function __construct()
    {
        $this->photos = new ArrayCollection();
        $this->demandeDevis = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getCivilite(): ?string
    {
        return $this->civilite;
    }

    public function setCivilite(string $civilite): static
    {
        $this->civilite = $civilite;

        return $this;
    }

    public function getAnneeNaissance(): ?\DateTimeInterface
    {
        return $this->annee_naissance;
    }

    public function setAnneeNaissance( $annee_naissance): static
    {
        $this->annee_naissance = $annee_naissance;

        return $this;
    }

    public function getAdress(): ?string
    {
        return $this->adress;
    }

    public function setAdress(?string $adress): static
    {
        $this->adress = $adress;

        return $this;
    }

    public function getCodePostal(): ?string
    {
        return $this->code_postal;
    }

    public function setCodePostal(?string $code_postal): static
    {
        $this->code_postal = $code_postal;

        return $this;
    }

    public function getVille(): ?string
    {
        return $this->ville;
    }

    public function setVille(?string $ville): static
    {
        $this->ville = $ville;

        return $this;
    }

    public function getPays(): ?string
    {
        return $this->pays;
    }

    public function setPays(string $pays): static
    {
        $this->pays = $pays;

        return $this;
    }

    public function getProfession(): ?string
    {
        return $this->profession;
    }

    public function setProfession(string $profession): static
    {
        $this->profession = $profession;

        return $this;
    }

    public function getTel(): ?string
    {
        return $this->tel;
    }

    public function setTel(string $tel): static
    {
        $this->tel = $tel;

        return $this;
    }

    public function getPoids(): ?string
    {
        return $this->poids;
    }

    public function setPoids(string $poids): static
    {
        $this->poids = $poids;

        return $this;
    }

    public function getTaille(): ?string
    {
        return $this->taille;
    }

    public function setTaille(string $taille): static
    {
        $this->taille = $taille;

        return $this;
    }

    public function isTabac(): ?bool
    {
        return $this->tabac;
    }

    public function setTabac(bool $tabac): static
    {
        $this->tabac = $tabac;

        return $this;
    }

    public function isAlcool(): ?bool
    {
        return $this->alcool;
    }

    public function setAlcool(bool $alcool): static
    {
        $this->alcool = $alcool;

        return $this;
    }

    public function getMedicament(): ?string
    {
        return $this->medicament;
    }

    public function setMedicament(?string $medicament): static
    {
        $this->medicament = $medicament;

        return $this;
    }

    public function getAllergie(): ?string
    {
        return $this->allergie;
    }

    public function setAllergie(?string $allergie): static
    {
        $this->allergie = $allergie;

        return $this;
    }

    public function getMaladie(): ?string
    {
        return $this->maladie;
    }

    public function setMaladie(?string $maladie): static
    {
        $this->maladie = $maladie;

        return $this;
    }

    public function getAntecendentChirurgicaux(): ?string
    {
        return $this->antecendent_chirurgicaux;
    }

    public function setAntecendentChirurgicaux(?string $antecendent_chirurgicaux): static
    {
        $this->antecendent_chirurgicaux = $antecendent_chirurgicaux;

        return $this;
    }

    public function getPhotos(): Collection
    {
        return $this->photos;
    }
    
    public function addPhoto(Photo $photo): self
    {
        if (!$this->photos->contains($photo)) {
            $this->photos->add($photo);
            $photo->setPatient($this);
        }
    
        return $this;
    }

    public function removePhoto(Photo $photo): self
    {
        if ($this->photos->removeElement($photo)) {
            // Déconnecter la photo du patient
            if ($photo->getPatient() === $this) {
                $photo->setPatient(null);
            }
        }
    
        return $this;
    }

  

    /**
     * @return Collection<int, DemandeDevis>
     */
    public function getDemandeDevis(): Collection
    {
        return $this->demandeDevis;
    }

    public function addDemandeDevis(DemandeDevis $demandeDevis): static
    {
        if (!$this->demandeDevis->contains($demandeDevis)) {
            $this->demandeDevis->add($demandeDevis);
            $demandeDevis->setPatient($this);
        }

        return $this;
    }

    public function removeDemandeDevis(DemandeDevis $demandeDevis): static
    {
        if ($this->demandeDevis->removeElement($demandeDevis)) {
            // set the owning side to null (unless already changed)
            if ($demandeDevis->getPatient() === $this) {
                $demandeDevis->setPatient(null);
            }
        }

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
            $this->devis->setPatient(null);
        }

        // set the owning side of the relation if necessary
        if ($devis !== null && $devis->getPatient() !== $this) {
            $devis->setPatient($this);
        }

        $this->devis = $devis;

        return $this;
    }
}
