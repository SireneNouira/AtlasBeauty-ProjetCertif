<?php
// src/DataPersister/DevisDataPersister.php
namespace App\DataPersister;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\CreateDevisInput;
use App\Entity\Devis;
use App\DataTransformer\CreateDevisDataTransformer;
use Doctrine\ORM\EntityManagerInterface;

final class DevisDataPersister implements ProcessorInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly CreateDevisDataTransformer $transformer,
    ) {}

    /**
     * @param CreateDevisInput|Devis $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Devis
    {
        // Si on reçoit le DTO, on le transforme en entité
        if ($data instanceof CreateDevisInput) {
            // transforme le DTO en entité Devis
            $devis = $this->transformer->transform($data, Devis::class, $context);
        }
        // Si on reçoit déjà une entité (PUT, PATCH…), on la prend telle quelle
        elseif ($data instanceof Devis) {
            $devis = $data;
        } else {
            throw new \InvalidArgumentException('Data type not supported by DevisDataPersister');
        }

        // Persist & flush comme pour Patient
        $this->entityManager->persist($devis);
        $this->entityManager->flush();

        return $devis;
    }
}
