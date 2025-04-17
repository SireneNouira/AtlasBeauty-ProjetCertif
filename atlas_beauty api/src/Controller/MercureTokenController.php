<?php

namespace App\Controller;

use Firebase\JWT\JWT;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class MercureTokenController extends AbstractController
{
    #[Route('/api/mercure-token', name: 'mercure_token', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        $user = $this->getUser();

        /**
         * @var User $user
         */
        $userId = $user->getId();
        $topics = [
            "http://example.com/chat/user-$userId",
            "http://example.com/chat/patient-$userId", // au cas où tu veux gérer les 2 types
        ];

        $payload = [
            'mercure' => [
                'subscribe' => $topics
            ],
            'exp' => (new \DateTimeImmutable('+1 hour'))->getTimestamp()
        ];

        $jwt = JWT::encode($payload, '311021', 'HS256');

        return $this->json(['token' => $jwt]);
    }
}
