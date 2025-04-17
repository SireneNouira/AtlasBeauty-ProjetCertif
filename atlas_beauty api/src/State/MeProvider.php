<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Patient;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;

class MeProvider implements ProviderInterface
{
    public function __construct(private Security $security) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $user = $this->security->getUser();

        if (!$user instanceof User && !$user instanceof Patient) {
            return [];
        }

        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'prenom' => $user instanceof Patient ? $user->getPrenom() : null,
            'nom' => $user instanceof Patient ? $user->getNom() : null,
            'userType' => $user instanceof Patient ? 'Patient' : 'User'
        ];
    }
}

// namespace App\State;

// use ApiPlatform\Metadata\Operation;
// use ApiPlatform\State\ProviderInterface;
// use App\Entity\Patient;
// use Symfony\Bundle\SecurityBundle\Security;

// class MeProvider implements ProviderInterface
// {
//     public function __construct(private Security $security) {}

//     public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?Patient
//     {
//         $user = $this->security->getUser();

//         if ($user instanceof Patient) {
//             return $user; // ✅ retourne l'entité complète, pas un tableau
//         }

//         return null;
//     }
// }
