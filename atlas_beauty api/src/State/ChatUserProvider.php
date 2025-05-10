<?php
namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Patient;
use App\Entity\User;
use App\Dto\ChatUserDto;
use Symfony\Bundle\SecurityBundle\Security;

class ChatUserProvider implements ProviderInterface
{
    public function __construct(
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ChatUserDto
    {
        $user = $this->security->getUser();
        $dto = new ChatUserDto();

        if (!$user instanceof User && !$user instanceof Patient) {
            return $dto;
        }

        $dto->id = $user->getId();
        $dto->email = $user->getEmail();
        $dto->role = $user instanceof Patient ? 'patient' : 'user';
        
        if ($user instanceof Patient) {
            $dto->prenom = $user->getPrenom();
            $dto->nom = $user->getNom();
            // Ajoutez d'autres champs spécifiques au patient si nécessaire
        } else {
            $dto->prenom = 'Assistant'; // Ou récupérez le prénom réel si disponible
            $dto->nom = '';
        }

        return $dto;
    }
}