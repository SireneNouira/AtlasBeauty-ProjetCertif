<?php
// Ce fichier est a créer dans src/DataPersister
namespace App\DataPersister;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\DataTransformer\PatientGlobalDtoToEntityTransformer;
use App\Dto\PatientGlobalDto;
use App\Entity\Patient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PatientDataPersister implements ProcessorInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly PatientGlobalDtoToEntityTransformer $transformer,
        private readonly RequestStack $requestStack,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Patient
    {

        // dd($data);

        if ($data instanceof PatientGlobalDto) {
            // Transformez le DTO en entité Patient
            $patient = $this->transformer->transform($data, new Patient());

            if ($patient->getPassword()) {
                $hashedPassword = $this->passwordHasher->hashPassword($patient, $patient->getPassword());
                $patient->setPassword($hashedPassword);
            }
            $patient->setRoles(['ROLE_USER']);

            // dd($patient);
            // Persistez le patient et les entités associées
            $this->entityManager->persist($patient);


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
