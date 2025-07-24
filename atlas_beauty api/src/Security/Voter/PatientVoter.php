<?php

namespace App\Security\Voter;

use App\Entity\Patient;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class PatientVoter extends Voter
{
    const VIEW = 'PATIENT_VIEW';
    const EDIT = 'PATIENT_EDIT';
    const DELETE = 'PATIENT_DELETE';

    private $authChecker;

    public function __construct(AuthorizationCheckerInterface $authChecker)
    {
        $this->authChecker = $authChecker;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        // Vérifie si l'attribut est l'un des droits que nous définissons
        $supportsAttribute = in_array($attribute, [self::VIEW, self::EDIT, self::DELETE]);

        // Si le sujet est null (par exemple pour une collection) ou une instance de Patient
        $supportsSubject = $subject === null || $subject instanceof Patient;

        return $supportsAttribute && $supportsSubject;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        // Si l'utilisateur n'est pas connecté, refuser l'accès
        if (!$user instanceof UserInterface) {
            return false;
        }

        // Si l'utilisateur a un rôle d'administrateur, lui accorder tous les droits
        if ($this->authChecker->isGranted('ROLE_ADMIN')) {
            return true;
        }

        // Vérifier que l'utilisateur est bien un Patient
        if (!$user instanceof Patient) {
            return false;
        }

        // Pour les opérations qui nécessitent un objet Patient spécifique
        if ($subject instanceof Patient) {
            switch ($attribute) {
                case self::VIEW:
                    return $this->canView($subject, $user);
                case self::EDIT:
                    return $this->canEdit($subject, $user);
                case self::DELETE:
                    return $this->canDelete($subject, $user);
            }
        }

        return false;
    }

    private function canView(Patient $patient, UserInterface $user): bool
    {
        // Le patient ne peut voir que ses propres informations
        return $user === $patient;
    }

    private function canEdit(Patient $patient, UserInterface $user): bool
    {
        // Le patient ne peut modifier que ses propres informations
        return $user === $patient;
    }

    private function canDelete(Patient $patient, UserInterface $user): bool
    {
        // Le patient ne peut supprimer que ses propres informations
        return $user === $patient;
    }
}