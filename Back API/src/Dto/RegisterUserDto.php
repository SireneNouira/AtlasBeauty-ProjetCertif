<?php

namespace App\Dto;

use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class RegisterUserDto
{
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['user:write', 'user:read'])]
    public string $email;

    #[Assert\NotBlank]
    #[Groups(['user:write'])]
    public string $password;

    #[Assert\NotBlank]
    #[Groups(['user:write', 'user:read'])]
    public string $nom;

    #[Assert\NotBlank]
    #[Groups(['user:write', 'user:read'])]
    public string $prenom;

    #[Assert\Choice(choices: ['user', 'vendeur'], message: 'Type d\'utilisateur invalide')]
    #[Groups(['user:write', 'user:read'])]
    public string $type;

      // Champs optionnels pour un vendeur
      #[Assert\NotBlank(groups: ['vendeur:create'])]
      #[Groups(['user:write', 'user:read'])]
      public ?string $nomEntreprise = null;
  
      #[Assert\NotBlank(groups: ['vendeur:create'])]
      #[Groups(['user:write', 'user:read'])]
      public ?string $adresseEntreprise = null;
}
