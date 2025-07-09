<?php
namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\MeProvider;

#[ApiResource(
    normalizationContext: ['groups' => ['me:read']],
    operations: [
        new Get(
            uriTemplate: '/me',
            provider: MeProvider::class,
            security: "is_granted('ROLE_USER', 'ROLE_ADMIN')",
        )
    ],
    routePrefix: '/')]
class Me {}

