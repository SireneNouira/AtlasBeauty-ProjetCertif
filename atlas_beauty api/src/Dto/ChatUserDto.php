<?php
namespace App\Dto;

use Symfony\Component\Serializer\Annotation\Groups;

class ChatUserDto
{
    #[Groups(['chat:read'])]
    public int $id;
    
    #[Groups(['chat:read'])]
    public string $email;
    
    #[Groups(['chat:read'])]
    public string $prenom;
    
    #[Groups(['chat:read'])]
    public string $nom;
    
    #[Groups(['chat:read'])]
    public string $role;
    
    #[Groups(['chat:read'])]
    public ?string $avatar;
}