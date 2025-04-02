<?php

namespace App\Security\Voter;

use App\Entity\DemandeDevis;
use App\Entity\Patient;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bundle\SecurityBundle\Security;

class DemandeDevisVoter extends Voter
{
    // Définition des actions possibles
    const VIEW = 'DEMANDE_DEVIS_VIEW';
    const CREATE = 'DEMANDE_DEVIS_CREATE';
    const EDIT = 'DEMANDE_DEVIS_EDIT';
    const DELETE = 'DEMANDE_DEVIS_DELETE';

    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        // Vérifie si l'attribut est l'un des droits que nous définissons
        $supportsAttribute = in_array($attribute, [self::VIEW, self::CREATE, self::EDIT, self::DELETE]);

        // Si le sujet est null (pour CREATE) ou une instance de DemandeDevis
        $supportsSubject = $subject === null || $subject instanceof DemandeDevis;

        return $supportsAttribute && $supportsSubject;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        // Si l'utilisateur n'est pas connecté, il ne peut qu'accéder à CREATE
        if (!$user instanceof UserInterface) {
            // Une personne non connectée peut uniquement créer une demande (pour s'inscrire)
            return $attribute === self::CREATE;
        }

        // Si l'utilisateur a un rôle d'administrateur ou d'assistant, lui accorder tous les droits
        if ($this->security->isGranted('ROLE_ADMIN') || $this->security->isGranted('ROLE_ASSISTANT')) {
            return true;
        }

        // Pour CREATE, vérifier si l'utilisateur a déjà une demande en cours
        if ($attribute === self::CREATE) {
            return $this->canCreate($user);
        }

        // Pour les autres opérations qui nécessitent un objet DemandeDevis spécifique
        if ($subject instanceof DemandeDevis) {
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

    private function canCreate(UserInterface $user): bool
    {
        // Tout le monde peut créer une demande de devis, mais un patient connecté 
        // ne peut en créer qu'une seule à la fois
        
        // Si l'utilisateur n'est pas un Patient, autoriser la création
        if (!$user instanceof Patient) {
            return true;
        }
        
        // Vérifier si le patient a déjà une demande en cours
        $demandeDevis = $user->getDemandeDevis();
        
        // Si le patient n'a pas de demande ou si toutes ses demandes sont vides,
        // alors il peut en créer une nouvelle
        return $demandeDevis->isEmpty();
    }

    private function canView(DemandeDevis $demandeDevis, UserInterface $user): bool
    {
        // Si l'utilisateur est un Patient, il ne peut voir que ses propres demandes
        if ($user instanceof Patient) {
            return $user === $demandeDevis->getPatient();
        }
        
        // Pour les autres types d'utilisateurs, la vérification est déjà faite
        // (admin et assistant ont accès à tout)
        return true;
    }

    private function canEdit(DemandeDevis $demandeDevis, UserInterface $user): bool
    {
        // Si l'utilisateur est un Patient, il ne peut modifier que ses propres demandes
        if ($user instanceof Patient) {
            return $user === $demandeDevis->getPatient();
        }
        
        // Pour les autres types d'utilisateurs, la vérification est déjà faite
        return true;
    }

    private function canDelete(DemandeDevis $demandeDevis, UserInterface $user): bool
    {
        // Si l'utilisateur est un Patient, il ne peut supprimer que ses propres demandes
        if ($user instanceof Patient) {
            return $user === $demandeDevis->getPatient();
        }
        
        // Pour les autres types d'utilisateurs, la vérification est déjà faite
        return true;
    }
}