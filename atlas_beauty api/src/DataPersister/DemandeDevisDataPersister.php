<?php

namespace App\DataPersister;

use ApiPlatform\State\ProcessorInterface;
use App\Entity\DemandeDevis;
use App\Entity\Patient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use ApiPlatform\Metadata\Operation;

class DemandeDevisDataPersister implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private ProcessorInterface $decorated,
        private Security $security
    ) {}

    public function supports($data, Operation $operation = null, array $context = []): bool
    {
        return $data instanceof DemandeDevis;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof DemandeDevis) {
            return $this->decorated->process($data, $operation, $uriVariables, $context);
        }

        // Empêcher la modification si devis signé
        if ($data->getDevis() && $data->getDevis()->isSigned()) {
            throw new BadRequestHttpException("Vous ne pouvez plus modifier la demande car le devis est signé.");
        }

        // Gestion de l'association du patient pour toutes les opérations d'écriture
        if ($operation->canWrite() && !$data->getPatient()) {
            $user = $this->security->getUser();
            
            if (!$user instanceof Patient) {
                throw new BadRequestHttpException("Seuls les patients peuvent créer ou modifier des demandes de devis.");
            }

            // Vérifier que le patient existe bien en base
            $existingPatient = $this->em->getRepository(Patient::class)->find($user->getId());
            if (!$existingPatient) {
                throw new BadRequestHttpException("Patient associé introuvable.");
            }

            $data->setPatient($existingPatient);
        }

        // Validation supplémentaire pour les nouvelles demandes
        if ($operation->getName() === 'post') {
            if (!$data->getIntervention1()) {
                throw new BadRequestHttpException("Une intervention principale est obligatoire.");
            }

            $data->setStatus('envoyé');
            $data->setDateCreation(new \DateTime());
        }

        return $this->decorated->process($data, $operation, $uriVariables, $context);
    }
}