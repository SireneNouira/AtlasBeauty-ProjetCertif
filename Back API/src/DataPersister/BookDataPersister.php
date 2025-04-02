<?php

namespace App\DataPersister;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Book;
use App\Repository\AuteurRepository;
use App\Repository\EtatRepository;
use App\Repository\GenreRepository;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\File\UploadedFile;
class BookDataPersister implements ProcessorInterface
{


    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly Security $security,
        private GenreRepository $genreRepository,
        private AuteurRepository $auteurRepository,
        private EtatRepository $etatRepository,
        private FileUploader $fileUploader
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Book
    {
        if ($this->security->getUser() === null) {
            throw new \Exception('User must be authenticated to create a book');
        }

        $data->setUser($this->security->getUser());

        if ($data instanceof Book && $operation instanceof Post) {
            $data->setUser($this->security->getUser());
        }

        if ($data instanceof Book && $operation instanceof Post) {
            $imageFile = $data->getImageFile();
            if ($imageFile instanceof UploadedFile) {
                $imageFileName = $this->fileUploader->upload($imageFile);
                $data->setImage('uploads/' . $imageFileName); // Enregistre le chemin relatif de l'image
            }
        }


        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }
}
