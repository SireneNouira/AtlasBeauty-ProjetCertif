<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\TokenExtractorInterface;

class JwtCookieExtractor implements TokenExtractorInterface
{
    private string $cookieName;

    public function __construct(string $cookieName = 'BEARER')
    {
        $this->cookieName = $cookieName;
    }

  public function extract(Request $request): ?string
{
    $token = $request->cookies->get($this->cookieName);
    if (!$token) {
        error_log('Cookie BEARER non trouvé');
    }
    return $token;
}
}
