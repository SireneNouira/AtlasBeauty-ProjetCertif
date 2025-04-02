<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\VendeurRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use App\DataPersister\BookDataPersister;

#[ApiResource(     operations: [
    new Get(
        normalizationContext: ['groups' => ['vendeur:read']],
        security: "is_granted('ROLE_VENDEUR')",
    ),
    new GetCollection(
        normalizationContext: ['groups' => ['vendeur:read']],
        security: "is_granted('ROLE_VENDEUR')",
    ),
    new Patch(
        denormalizationContext: ['groups' => ['vendeur:write']],
        security: "is_granted('ROLE_VENDEUR')",
        securityMessage: "Vous ne pouvez modifier que vos propres informations",
    ),
]
)]
#[ORM\Entity]
class Vendeur extends User
{
    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(groups: ['vendeur:write'])]
    #[Groups(['user:write', 'user:read'])]
    private ?string $nomEntreprise = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(groups: ['vendeur:write'])]
    #[Groups(['user:write', 'user:read'])]
    private ?string $adresseEntreprise = null;

    public function getNomEntreprise(): ?string
    {
        return $this->nomEntreprise;
    }

    public function setNomEntreprise(string $nomEntreprise): static
    {
        $this->nomEntreprise = $nomEntreprise;

        return $this;
    }

    public function getAdresseEntreprise(): ?string
    {
        return $this->adresseEntreprise;
    }

    public function setAdresseEntreprise(string $adresseEntreprise): static
    {
        $this->adresseEntreprise = $adresseEntreprise;

        return $this;
    }
}
