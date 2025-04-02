<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class JWTAuthenticatedListener
{
    public function __construct(private NormalizerInterface $normalizer) {}

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event): void
    {
        $token = $event->getData()['token'];

        $cookie = Cookie::create('auth_token', $token)
            ->withHttpOnly(true)
            ->withSecure(false) // true en prod
            ->withSameSite('Lax')
            ->withPath('/')
            ->withExpires(new \DateTime('+1 hour'));

        $response = $event->getResponse();
        $response->headers->setCookie($cookie);

        $user = $event->getUser();

        // Ajoute les données utilisateur dans la réponse JSON
        $event->setData([
            'user' => $this->normalizer->normalize($user, null, ['groups' => ['me:read']])
        ]);
    }
}


// namespace App\EventListener;

// use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
// use Symfony\Component\HttpFoundation\Cookie;

// class JWTAuthenticatedListener
// {
//     public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event): void
//     {
//         $token = $event->getData()['token'];

//         $cookie = Cookie::create('auth_token', $token)
//             ->withHttpOnly(true)
//             ->withSecure(false) // Mets à true si tu actives HTTPS en prod
//             ->withSameSite('Lax')
//             ->withPath('/')
//             ->withExpires(new \DateTime('+1 hour'));

//         $response = $event->getResponse();
//         $response->headers->setCookie($cookie);

//         // Optionnel : ne pas renvoyer le token dans le body
//         $event->setData([
//             'user' => $event->getUser()->getUserIdentifier()
//         ]);
//     }
// }
