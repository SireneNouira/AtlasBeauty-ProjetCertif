<?php

namespace App\Controller;

use App\Service\FileUploader;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ImageUploadController extends AbstractController
{
    private $fileUploader;

    public function __construct(FileUploader $fileUploader)
    {
        $this->fileUploader = $fileUploader;
    }

    /**
     * @Route("/api/upload", name="image_upload", methods={"POST"})
     */
    public function upload(Request $request): JsonResponse
    {
        $file = $request->files->get('image');

        if ($file) {
            // Utilise le service pour uploader l'image
            $fileName = $this->fileUploader->upload($file);

            // Retourne l'URL de l'image
            return new JsonResponse([
                'image_url' => '/uploads/' . $fileName
            ]);
        }

        return new JsonResponse(['error' => 'Aucune image reçue'], 400);
    }
}
