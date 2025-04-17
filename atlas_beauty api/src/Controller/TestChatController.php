<?php

namespace App\Controller;

use App\Service\MercurePublisher;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class TestChatController
{
    #[Route('/api/chat-test', name: 'chat_test', methods: ['POST'])]
    public function __invoke(MercurePublisher $publisher): JsonResponse
    {
        $publisher->publish(
            'http://example.com/chat/test',
            ['content' => 'Coucou depuis Symfony 😄']
        );

        return new JsonResponse(['status' => 'ok']);
    }
}
