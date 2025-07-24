<?php

namespace App\Security;

use App\Entity\Patient;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    public function onAuthenticationSuccess($request, $token): JsonResponse
    {
        $user = $token->getUser();
        
        // Vérifie le type d'utilisateur
        if ($user instanceof Patient) {
            // L'utilisateur est un Patient
            $userType = 'Patient';
        } elseif ($user instanceof User) {
            // L'utilisateur est un User
            $userType = 'User';
        } else {
            // Cas où l'utilisateur n'est ni un Patient ni un User
            $userType = 'Unknown';
        }

        $jwt = $this->jwtManager->create($user);

        // Créer un cookie HttpOnly avec le JWT
        $response = new JsonResponse([
            'token' => $jwt,
            'message' => 'Connexion réussie',
            'userType' => $userType,
        ]);
                $response->headers->setCookie(
             new Cookie('BEARER', $jwt, 0, '/', null, false, true, false, 'Strict') // a enlever pour la mise en prod 
             // HttpOnly et Secure ajouter pour la mise en prod
        );

        return $response;
    }
}
