<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class MeProvider implements ProviderInterface
{
    public function __construct(
        private Security $security
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array
{
    $user = $this->security->getUser();
    
    if (!$user) {
        throw new UnauthorizedHttpException('Bearer', 'Authentication required');
    }

    // Retournez l'objet User directement
    return $user;
}
}