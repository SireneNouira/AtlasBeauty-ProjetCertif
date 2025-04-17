<?php

namespace App\Controller;

use Firebase\JWT\JWT;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\User;
use App\Entity\Patient;

class MercureTokenController extends AbstractController
{
    #[Route('/api/mercure-token', name: 'mercure_token', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        $user = $this->getUser();
        $topics = [];

        // Si l'utilisateur est un User normal
        if ($user instanceof User) {
            $topics[] = "http://example.com/chat/user-{$user->getId()}";
            
            // Ajoutez ici d'autres topics spécifiques aux Users si nécessaire
        }
        // Si l'utilisateur est un Patient
        elseif ($user instanceof Patient) {
            $topics[] = "http://example.com/chat/patient-{$user->getId()}";
            
            // Ajoutez ici d'autres topics spécifiques aux Patients si nécessaire
        }

        $payload = [
            'mercure' => [
                'subscribe' => $topics,
                'publish' => $topics // Permet aussi de publier sur ces topics
            ],
            'exp' => (new \DateTimeImmutable('+1 hour'))->getTimestamp()
        ];

        // Utilisez la clé Mercure depuis l'environnement
        $jwtSecret = $this->getParameter('mercure_jwt_secret');
        $jwt = JWT::encode($payload, $jwtSecret, 'HS256');

        return $this->json(['token' => $jwt]);
    }
}