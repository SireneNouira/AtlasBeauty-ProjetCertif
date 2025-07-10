<?php

namespace App\Serializer\Encoder;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\Encoder\DecoderInterface;

class MultipartFormDataDecoder implements DecoderInterface
{
    private const FORMAT = 'multipart';


    /**
     * Définition des types attendus pour chaque champ du DTO
     */
    private const FIELD_TYPES = [
        // Booléens
        'tabac' => 'boolean',
        'alcool' => 'boolean',

        // Entiers
        'annee_naissance' => 'integer',

        // Flottants
        'poids' => 'float',
        'taille' => 'float',

        // Dates
        'date_souhaite' => 'date',
    ];

    public function __construct(private RequestStack $requestStack) {}

    public function decode(string $data, string $format, array $context = []): array
    {

        $request = $this->requestStack->getCurrentRequest();

        if (null === $request) {
            return [];
        }

        // Récupérer les données de la requête
        $result = array_merge(
            $request->query->all(),
            $request->request->all(),
            // $request->files->all()
        );

        // Traitement spécial pour les fichiers (séparé du reste pour éviter les erreurs)
        foreach ($request->files->all() as $key => $value) {
            if ($value instanceof UploadedFile) {
                $result[$key] = $value;                     // fichier unique
            } elseif (is_array($value)) {
                // tableau de fichiers : on filtre ceux qui sont valides
                $result[$key] = array_values(array_filter($value, function ($file) {
                    return $file instanceof UploadedFile && $file->getError() === UPLOAD_ERR_OK;
                }));
            }
        }


        // Convertir les champs selon leur type attendu
        foreach (self::FIELD_TYPES as $field => $type) {
            if (isset($result[$field])) {
                $result[$field] = $this->convertField($result[$field], $type);
            }
        }

        // dd($result);

        return $result;
    }

    /**
     * Convertit une valeur au type spécifié
     */
    private function convertField(mixed $value, string $type): mixed
    {
        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            'integer' => is_numeric($value) ? (int)$value : 0,  // Valeur par défaut 0 si non numérique
            'float' => is_numeric($value) ? (float)$value : 0.0,  // Valeur par défaut 0.0 si non numérique
            'date' => $value,
            default => $value,
        };
    }

    public function supportsDecoding(string $format, array $context = []): bool
    {
        return self::FORMAT === $format;
    }
}