<?php
// namespace App\Dto;

// use Symfony\Component\Serializer\Annotation\Groups;

// final class MeDto
// {
//     #[Groups(['me:read'])]
//     public int $id;

//     #[Groups(['me:read'])]
//     public string $email;

//     #[Groups(['me:read'])]
//     public string $prenom;

//     #[Groups(['me:read'])]
//     public string $nom;
// }


// src/Dto/MeDto.php
namespace App\Dto;

use Symfony\Component\Serializer\Annotation\Groups;

final class MeDto
{
    // Infos de base
    #[Groups(['me:read'])]
    public int $id;
    
    #[Groups(['me:read'])]
    public string $email;
    
    #[Groups(['me:read'])]
    public string $prenom;
    
    #[Groups(['me:read'])]
    public string $nom;
    
    #[Groups(['me:read'])]
    public string $civilite;
    
    #[Groups(['me:read'])]
    public ?int $annee_naissance;
    
    // Adresse
    #[Groups(['me:read'])]
    public ?string $adress;
    
    #[Groups(['me:read'])]
    public ?string $code_postal;
    
    #[Groups(['me:read'])]
    public ?string $ville;
    
    #[Groups(['me:read'])]
    public string $pays;
    
    // Autres infos
    #[Groups(['me:read'])]
    public string $profession;
    
    #[Groups(['me:read'])]
    public string $tel;
    
    #[Groups(['me:read'])]
    public ?float $poids;
    
    #[Groups(['me:read'])]
    public ?float $taille;
    
    #[Groups(['me:read'])]
    public ?bool $tabac;
    
    #[Groups(['me:read'])]
    public ?bool $alcool;
    
    #[Groups(['me:read'])]
    public ?string $antecedents;
    
    // Demandes et devis
    #[Groups(['me:read'])]
    public ?array $demandeDevis = null;
    
    #[Groups(['me:read'])]
    public ?array $devis = null;
    
    #[Groups(['me:read'])]
    public array $photos = [];
    
    // Statut global
    #[Groups(['me:read'])]
    public array $status = [];
}