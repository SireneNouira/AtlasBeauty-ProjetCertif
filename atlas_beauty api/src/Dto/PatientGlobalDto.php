<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;


class PatientGlobalDto
{
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['patient:write'])]
    public string $email;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $password;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $nom;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $prenom;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $civilite;


    #[Groups(['patient:write'])]
    public int $annee_naissance;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $pays;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $profession;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $tel;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public float $poids;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public float $taille;

    #[Assert\Type('string')]
    #[Groups(['patient:write'])]
    public ?string $antecedents = null;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $ville;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $adress;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $code_postal;

    #[Assert\NotNull]
    #[Groups(['patient:write'])]
    public bool $tabac = false;

    #[Assert\NotNull]
    #[Groups(['patient:write'])]
    public bool $alcool = false;

    #[Groups(['patient:write'])]
    #[Assert\All([
        new Assert\File([
            'maxSize' => '5M',
            'mimeTypes' => ['image/jpeg', 'image/png'],
            'mimeTypesMessage' => 'Please upload a valid image (JPEG or PNG)',
        ])
    ])]

    public ?array $photoFiles = [];

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $note;

    #[Groups(['patient:write'])]
    public string $date_souhaite;

    #[Assert\NotBlank]
    #[Groups(['patient:write'])]
    public string $intervention_1_name;

    // Doit être initialisé à null pour éviter les erreurs de sérialisation (cannot access before initialization)
    #[Groups(['patient:write'])]
    public ?string $intervention_2_name = null;
}
