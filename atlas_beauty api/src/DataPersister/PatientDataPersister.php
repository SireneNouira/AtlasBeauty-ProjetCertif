<?php
// Ce fichier est a créer dans src/DataPersister
namespace App\DataPersister;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\DataTransformer\PatientGlobalDtoToEntityTransformer;
use App\Dto\PatientGlobalDto;
use App\Entity\Patient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PatientDataPersister implements ProcessorInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly PatientGlobalDtoToEntityTransformer $transformer 
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Patient
    {
          // Vérifiez si $data est un PatientGlobalDto
          if ($data instanceof PatientGlobalDto) {
            // Transformez le DTO en entité Patient
            $patient = $this->transformer->transform($data, new Patient());

            if ($patient->getPassword()) {
                $hashedPassword = $this->passwordHasher->hashPassword($patient, $patient->getPassword());
                $patient->setPassword($hashedPassword);
            }
            $patient->setRoles(['ROLE_USER']);

             // Persistez le patient et les entités associées
             $this->entityManager->persist($patient);

             foreach ($patient->getPhotos() as $photo) {
                $photo->setPatient($patient); // Associe le patient à la photo
                $this->entityManager->persist($photo); // Persiste la photo
            }

            foreach ($patient->getDemandeDevis() as $demandeDevis) {
                $demandeDevis->setPatient($patient);
                $demandeDevis->setStatus('envoyé');
                $demandeDevis->setDateCreation(new \DateTime());
                $this->entityManager->persist($demandeDevis);
            }
            
            $this->entityManager->flush();

            return $patient; // Retournez l'entité Patient
        }

        // Si $data est déjà une entité Patient, persistez-la directement
        if ($data instanceof Patient) {
            $this->entityManager->persist($data);
            $this->entityManager->flush();
            return $data;
        }

        throw new \InvalidArgumentException('Unsupported data type');
    }
}