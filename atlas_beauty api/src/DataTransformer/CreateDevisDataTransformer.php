<?php
// src/DataTransformer/CreateDevisDataTransformer.php
namespace App\DataTransformer;

use App\Dto\CreateDevisInput;
use App\Entity\Devis;
use Symfony\Component\HttpFoundation\File\UploadedFile;

use App\Repository\PatientRepository;

final class CreateDevisDataTransformer
{
    private PatientRepository $patientRepository;

    public function __construct(PatientRepository $patientRepository)
    {
        $this->patientRepository = $patientRepository;
    }

    public function transform(CreateDevisInput $dto, string $to, array $context = []): Devis
    {
        $devis = new Devis();

        // 1) Le fichier
        /** @var UploadedFile $file */
        $file = $dto->devisFile;
        $devis->setDevisFile($file);
        $devis->setFichier($file->getClientOriginalName()); 
        // 2) Relations (API Platform convertira l’IRI en objet pour vous)
        $patient = null;
        if ($dto->patient) {
            $patient = $this->patientRepository->find($dto->patient);
        }
        $devis->setPatient($patient);
        $devis->setDemandeDevis($dto->demande_devis);

        // 3) Les autres champs
        $devis->setDateOperation(new \DateTime($dto->date_operation));
        $devis->setIsSigned($dto->is_signed);
        $devis->setDateSejour(new \DateTime($dto->date_sejour));

        return $devis;
    }

    public function supportsTransformation($data, string $to, array $context = []): bool
    {
        return $data instanceof CreateDevisInput && Devis::class === $to;
    }
}
