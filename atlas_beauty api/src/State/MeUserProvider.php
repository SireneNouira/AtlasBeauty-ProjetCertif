<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Dto\MeUserDto;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;

class MeUserProvider implements ProviderInterface
{
    public function __construct(private Security $security) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?MeUserDto
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            return null; // Pas connecté ou pas User
        }

        $dto = new MeUserDto();
        $dto->id = $user->getId();
        $dto->email = $user->getEmail();
        $dto->roles = $user->getRoles();
        // $dto->userType déjà mis à 'User'

        return $dto;
    }
}
