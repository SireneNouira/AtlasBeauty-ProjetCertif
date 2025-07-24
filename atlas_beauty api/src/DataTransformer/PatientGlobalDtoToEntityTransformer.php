<?php

namespace App\DataTransformer;



use App\Dto\PatientGlobalDto;
use App\Entity\Patient;
use App\Entity\Photo;
use App\Entity\DemandeDevis;
use App\Entity\Intervention;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

class PatientGlobalDtoToEntityTransformer
{
    public function __construct(
        private SerializerInterface $serializer,
        private EntityManagerInterface $entityManager,
    ) {}

    public function transform(PatientGlobalDto $dto, Patient $patient,  array $context = []): Patient
    {
        // Si un patient existe déjà (pour une mise à jour), on le récupère
        $context = [
            AbstractNormalizer::GROUPS => ['patient:write'],
        ];
        if ($patient) {
            $context[AbstractNormalizer::OBJECT_TO_POPULATE] = $patient;
        }

        // Transfert manuel des propriétés du DTO vers l'entité Patient
        $patient->setEmail($dto->email);
        if (!empty($dto->password)) {
            $patient->setPassword($dto->password);
        }

            $patient->setNom($dto->nom);
            $patient->setPrenom($dto->prenom);
            $patient->setCivilite($dto->civilite);
            $patient->setAnneeNaissance($dto->annee_naissance);
            $patient->setPays($dto->pays);
            $patient->setProfession($dto->profession);
            $patient->setTel($dto->tel);
            $patient->setPoids($dto->poids);
            $patient->setTaille($dto->taille);
            $patient->setTabac($dto->tabac);
            $patient->setAlcool($dto->alcool);
            $patient->setAntecedents($dto->antecedents);
            $patient->setVille($dto->ville);
            $patient->setAdress($dto->adress);
            $patient->setCodePostal($dto->code_postal);

        if ($dto->photoFiles) {
            foreach ($dto->photoFiles as $uploadedFile) {
                if ($uploadedFile instanceof UploadedFile && $uploadedFile->getError() === UPLOAD_ERR_OK) {
                    $photo = new Photo();
                    $photo->setPhotoFile($uploadedFile);
                    $photo->setPatient($patient);
                    $patient->addPhoto($photo);
                }
            }
        }

        // Crée la demande de devis associée
        $demandeDevis = new DemandeDevis();
        $demandeDevis->setPatient($patient);
        $demandeDevis->setNote($dto->note);
        try {
            $demandeDevis->setDateSouhaite(new \DateTime($dto->date_souhaite));
        } catch (\Exception $e) {
            throw new \InvalidArgumentException('Invalid date format. Expected YYYY-MM-DD');
        }
        $demandeDevis->setStatus('envoyé');
        $demandeDevis->setDateCreation(new \DateTime());

        // 🔹 Rechercher les interventions dans la base de données
        if ($dto->intervention_1_name) {
            $intervention1 = $this->entityManager
                ->getRepository(Intervention::class)
                ->findOneBy(['name' => $dto->intervention_1_name]);

            if ($intervention1) {
                $demandeDevis->setIntervention1($intervention1);
            }
        }

        if ($dto->intervention_2_name) {

            $intervention2 = $this->entityManager
                ->getRepository(Intervention::class)
                ->findOneBy(['name' => $dto->intervention_2_name]);

            if ($intervention2) {
                $demandeDevis->setIntervention2($intervention2);
            }
        }
        // Associe les entités
        $patient->addDemandeDevis($demandeDevis);

        return $patient;
    }
}
