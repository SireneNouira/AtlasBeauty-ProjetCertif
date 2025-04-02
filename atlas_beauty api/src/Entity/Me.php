<?php

namespace App\Entity;


use App\Dto\PatientGlobalDto;
use App\Service\PatientDataPersister;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\DataPersister\PatientDataPersister as DataPersisterPatientDataPersister;
use App\Service\MeProvider;
// use App\Dto\PatientGlobalDto;
use Doctrine\ORM\Mapping as ORM;


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
            processor: DataPersisterPatientDataPersister::class
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
class Me
{
    private $id;
    private $email;
    private $firstName;
    private $lastName;

    public function __construct(MeProvider $meProvider)
    {
        $user = $meProvider->getCurrentUser(); // Utilise le service MeProvider

        // Si l'utilisateur connecté est un Patient
        if ($user instanceof Patient) {
            $this->id = $user->getId();
            $this->email = $user->getEmail();
            $this->firstName = $user->getPrenom();
            $this->lastName = $user->getNom();
        }

        // Si l'utilisateur connecté est un User
        // elseif ($user instanceof User) {
        //     $this->id = $user->getId();
        //     $this->email = $user->getEmail();
        //     $this->firstName = $user->getFirstName();
        //     $this->lastName = $user->getLastName();
        // }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->firstName;
    }

    public function setPrenom(string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getNom(): ?string
    {
        return $this->lastName;
    }

    public function setNom(string $lastName): self
    {
        $this->lastName = $lastName;
        return $this;
    }
}
