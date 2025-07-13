<?php
// src/Dto/CreateDevisInput.php
namespace App\Dto;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Annotation\Groups;

final class CreateDevisInput
{
    /** 
     * @var UploadedFile|null 
     * @Groups({"devis:write"})
     */
    public ?UploadedFile $devisFile = null;

    /** 
     * IRI du patient 
     * @Groups({"devis:write"})
     */
    public string $patient;

    /** 
     * IRI de la demande de devis (optionnel) 
     * @Groups({"devis:write"})
     */
    public ?string $demande_devis = null;

    /**
     * @Groups({"devis:write"})
     */
    public string $date_operation;

    /**
     * @Groups({"devis:write"})
     */
    public bool $is_signed = false;

    /**
     * @Groups({"devis:write"})
     */
    public string $date_sejour;
}
