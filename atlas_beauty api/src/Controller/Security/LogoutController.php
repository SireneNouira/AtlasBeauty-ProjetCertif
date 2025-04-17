<?php

namespace App\Controller\Security;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LogoutController
{
    /**
     * Déconnecte l'utilisateur et supprime le cookie BEARER.
     *
     * @return Response
     */
    #[Route('/logout', name: 'app_logout')]
    public function logout(): Response
    {
        // Supprime le cookie BEARER
        $response = new RedirectResponse('/login_check'); // ou vers '/' si tu veux

        $response->headers->clearCookie('BEARER', '/', null, true, true, false, 'strict');

        return $response;
    }
}
