<?php

namespace App\DataPersister;

use ApiPlatform\Doctrine\Common\DataPersister;
use ApiPlatform\Metadata\Operation;
use App\Entity\DemandeDevis;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use App\Entity\Patient;

class DemandeDevisDataPersister implements DataPersister
{
    private $entityManager;
    private $decoratedDataPersister;
    private $security;

    public function __construct(
        EntityManagerInterface $entityManager,
        DataPersister $decoratedDataPersister,
        Security $security
    ) {
        $this->entityManager = $entityManager;
        $this->decoratedDataPersister = $decoratedDataPersister;
        $this->security = $security;
    }

    public function supports($data, Operation $operation = null, array $context = []): bool
    {
        return $data instanceof DemandeDevis;
    }

    public function persist($data, Operation $operation = null, array $context = [])
    {
        // Si c'est une création de demande
        if ($data instanceof DemandeDevis && !$data->getId()) {
            $user = $this->security->getUser();
            
            // Si l'utilisateur est connecté et qu'il s'agit d'un patient
            if ($user instanceof Patient) {
                // Vérifier s'il a déjà une demande en cours
                if (!$user->getDemandeDevis()->isEmpty()) {
                    throw new BadRequestHttpException('Vous avez déjà une demande de devis en cours. Supprimez-la avant d\'en créer une nouvelle.');
                }
                
                // Assigner le patient à la demande
                $data->setPatient($user);
            }
            // Si non connecté, c'est géré par le processus d'inscription
        }

        // Déléguer la persistence au décorateur
        return $this->decoratedDataPersister->persist($data, $operation, $context);
    }

    public function remove($data, Operation $operation = null, array $context = [])
    {
        return $this->decoratedDataPersister->remove($data, $operation, $context);
    }
}