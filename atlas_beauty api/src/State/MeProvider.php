<?php

// namespace App\State;

// use ApiPlatform\Metadata\Operation;
// use ApiPlatform\State\ProviderInterface;
// use App\Entity\Patient;
// use App\Entity\User;
// use Symfony\Bundle\SecurityBundle\Security;

// class MeProvider implements ProviderInterface
// {
//     public function __construct(private Security $security) {}

//     public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
//     {
//         $user = $this->security->getUser();

//         if (!$user instanceof User && !$user instanceof Patient) {
//             return [];
//         }

//         return [
//             'id' => $user->getId(),
//             'email' => $user->getEmail(),
//             'prenom' => $user instanceof Patient ? $user->getPrenom() : null,
//             'nom' => $user instanceof Patient ? $user->getNom() : null,
//             'userType' => $user instanceof Patient ? 'Patient' : 'User'
//         ];
//     }
// }

// namespace App\State;

// use ApiPlatform\Metadata\Operation;
// use ApiPlatform\State\ProviderInterface;
// use App\Entity\Patient;
// use Symfony\Bundle\SecurityBundle\Security;

// class MeProvider implements ProviderInterface
// {
//     public function __construct(private Security $security) {}

//     public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?Patient
//     {
//         $user = $this->security->getUser();

//         if ($user instanceof Patient) {
//             return $user; // ✅ retourne l'entité complète, pas un tableau
//         }

//         return null;
//     }
// }



// src/State/MeProvider.php
namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Patient;
use App\Entity\User;
use App\Dto\MeDto;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class MeProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $em
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): MeDto
    {
        $user = $this->security->getUser();
        $dto = new MeDto();

        if (!$user instanceof User && !$user instanceof Patient) {
            return $dto;
        }

        // Infos de base
        $dto->id = $user->getId();
        $dto->email = $user->getEmail();
        
        if ($user instanceof Patient) {
            $this->populatePatientData($dto, $user);
        }

        return $dto;
    }

    private function populatePatientData(MeDto $dto, Patient $patient): void
    {
        // Infos personnelles
        $dto->prenom = $patient->getPrenom();
        $dto->nom = $patient->getNom();
        $dto->civilite = $patient->getCivilite();
        $dto->annee_naissance = $patient->getAnneeNaissance();
        
        // Adresse
        $dto->adress = $patient->getAdress();
        $dto->code_postal = $patient->getCodePostal();
        $dto->ville = $patient->getVille();
        $dto->pays = $patient->getPays();
        
        // Autres infos
        $dto->profession = $patient->getProfession();
        $dto->tel = $patient->getTel();
        $dto->poids = $patient->getPoids();
        $dto->taille = $patient->getTaille();
        $dto->tabac = $patient->isTabac();
        $dto->alcool = $patient->isAlcool();
        $dto->antecedents = $patient->getAntecedents();
        
        // Photos
        foreach ($patient->getPhotos() as $photo) {
            $dto->photos[] = [
                'id' => $photo->getId(),
                'path' => $photo->getPhotoPath(),
                'uploadedAt' => $photo->getUpdatedAt()?->format('Y-m-d H:i:s')
            ];
        }
        
        // Demande de devis
        $demandeDevis = $patient->getDemandeDevis()->first() ?: null;
        if ($demandeDevis) {
            $dto->demandeDevis = [
                'id' => $demandeDevis->getId(),
                'note' => $demandeDevis->getNote(),
                'date_souhaite' => $demandeDevis->getDateSouhaite()?->format('Y-m-d'),
                'status' => $demandeDevis->getStatus(),
                'date_creation' => $demandeDevis->getDateCreation()?->format('Y-m-d H:i:s'),
                'intervention_1' => $demandeDevis->getIntervention1()?->getName(),
                'intervention_2' => $demandeDevis->getIntervention2()?->getName()
            ];
        }
        
        // Devis
        $devis = $patient->getDevis();
        if ($devis) {
            $dto->devis = [
                'id' => $devis->getId(),
                'fichier' => $devis->getFichier(),
                'date_operation' => $devis->getDateOperation()?->format('Y-m-d'),
                'is_signed' => $devis->isSigned(),
                'date_sejour' => $devis->getDateSejour()?->format('Y-m-d')
            ];
        }
        
        // Statut global
        $dto->status = [
            'hasPhotos' => !$patient->getPhotos()->isEmpty(),
            'hasDemandeDevis' => $demandeDevis !== null,
            'hasDevis' => $devis !== null,
            'devisSigned' => $devis?->isSigned() ?? false,
            'demandeDevisStatus' => $demandeDevis?->getStatus() ?? null
        ];
    }
}