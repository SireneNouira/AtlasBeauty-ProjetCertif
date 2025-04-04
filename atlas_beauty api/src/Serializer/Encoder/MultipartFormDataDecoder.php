<?php

namespace App\Serializer\Encoder;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\Encoder\DecoderInterface;

class MultipartFormDataDecoder implements DecoderInterface
{
    public function __construct(private RequestStack $requestStack) {}

    public function decode(string $data, string $format, array $context = []): array
    {
        $request = $this->requestStack->getCurrentRequest();
        if (!$request) {
            return [];
        }
        // Récupère les champs texte et fichiers
        return array_merge($request->request->all(), $request->files->all());
    }

    public function supportsDecoding(string $format): bool
    {
        return 'multipart' === $format;
    }
}
