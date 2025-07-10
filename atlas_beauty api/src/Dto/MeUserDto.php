<?php

namespace App\Dto;

use Symfony\Component\Serializer\Annotation\Groups;

final class MeUserDto
{
    #[Groups(['me:user:read'])]
    public int $id;

    #[Groups(['me:user:read'])]
    public string $email;

    #[Groups(['me:user:read'])]
    public array $roles;

    #[Groups(['me:user:read'])]
    public string $userType = 'User'; // Fixé pour assistant/admin
}
