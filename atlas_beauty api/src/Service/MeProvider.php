<?php



namespace App\Service;

use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class MeProvider
{
    private $tokenStorage;

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    public function getCurrentUser()
    {
        $token = $this->tokenStorage->getToken();

        if ($token) {
            return $token->getUser();  // Retourne l'utilisateur authentifié
        }

        return null;
    }
}


