<?php

namespace App\Security\Voter;

use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserVoter extends Voter
{
    public const VIEW = 'USER_VIEW';
    public const EDIT = 'USER_EDIT';
    public const DELETE = 'USER_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // Vérifie si l'attribut est 'USER_EDIT' ou 'USER_DELETE' et si le sujet est une instance de User
        return in_array($attribute, [self::VIEW,self::EDIT, self::DELETE])
            && $subject instanceof User;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        
        // Si l'utilisateur est anonyme, refuser l'accès
        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var User $targetUser */
        $targetUser = $subject;

        // Vérifie si l'utilisateur courant est le propriétaire du compte
        return match($attribute) {
            self::VIEW,self::EDIT, self::DELETE => $this->isOwner($targetUser, $user),
            default => false,
        };
    }

    private function isOwner(User $targetUser, User $user): bool
    {
        return $targetUser === $user;  // Vérifie si les deux utilisateurs sont identiques (propriétaire du compte)
    }
}
