<?php
namespace App\Dto;

use Symfony\Component\Serializer\Annotation\Groups;

final class MeDto
{
    #[Groups(['me:read'])]
    public int $id;

    #[Groups(['me:read'])]
    public string $email;

    #[Groups(['me:read'])]
    public string $prenom;

    #[Groups(['me:read'])]
    public string $nom;
}
