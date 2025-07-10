<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\MeUserProvider;

#[ApiResource(
    normalizationContext: ['groups' => ['me:user:read']],
    operations: [
        new Get(
            uriTemplate: '/me-user',
            provider: MeUserProvider::class,
            security: "is_granted('ROLE_ASSISTANT') or is_granted('ROLE_ADMIN')"
        )
    ],
    routePrefix: '/'
)]
class MeUser {}
