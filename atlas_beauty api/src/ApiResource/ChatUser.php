<?php
namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\ChatUserProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/me/chat',
            normalizationContext: ['groups' => ['chat:read']],
            provider: ChatUserProvider::class,
            security: "is_granted('ROLE_USER')"
        )
    ]
)]
class ChatUser {}