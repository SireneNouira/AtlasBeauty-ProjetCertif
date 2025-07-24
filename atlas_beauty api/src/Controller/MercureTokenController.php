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
        $user   = $this->getUser();
        $topics = [];

        if ($user instanceof User) {
            $topics[] = "http://example.com/chat/user-{$user->getId()}";
        } elseif ($user instanceof Patient) {
            $topics[] = "http://example.com/chat/patient-{$user->getId()}";
        }
        $payload = [
            'mercure' => [
                'subscribe' => $topics,
                'publish'   => ['*'],
            ],
            'exp'     => (new \DateTimeImmutable('+6 hour'))->getTimestamp(),
        ];
        $jwtSecret = $this->getParameter('mercure_jwt_secret');
        $jwt       = JWT::encode($payload, $jwtSecret, 'HS256');
        return $this->json(['token' => $jwt]);
    }
}
