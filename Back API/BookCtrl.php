<?php

// namespace App\Controller;
// // bookController  avant api platform
// use App\Entity\Book;
// use App\Repository\BookRepository;
// use Doctrine\ORM\EntityManagerInterface;
// use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\HttpFoundation\JsonResponse;
// use Symfony\Component\HttpFoundation\Request;
// use Symfony\Component\Routing\Attribute\Route;
// use Symfony\Component\Serializer\SerializerInterface;

// #[Route('/api', name: 'api_')]
// final class BookController extends AbstractController
// {
//     public function __construct(
//         private readonly BookRepository $bookRepository,
//         private readonly EntityManagerInterface $entityManager,
//         private readonly SerializerInterface $serializer // Le serializer de Symfony
//     ) {}

//     #[Route('/books', name: 'books_index', methods: ['GET'])]
//     public function index(): JsonResponse
//     {
//         $books = $this->bookRepository->findAll();
//         return $this->json(['data' => $books], context: [
//             'groups' => ['book:read']
//         ]);
//     }
//     #[Route('/books/{id}', name: 'books_show', methods: ['GET'])]
//     public function show(Book $book): JsonResponse
//     {
//         return $this->json(['data' => $book], context: ['groups' => 'book:read']);
//     }
//     #[Route('/books', name: 'books_create', methods: ['POST'])]
//     public function create(Request $request): JsonResponse
//     {
//         // Les datas nous sont envoyées en JSON on va donc utiliser le serializer de Symfony pour les désérialiser et hydrater nos objets directement
//         try {
//             /** @var Book $book */
//             $book = $this->serializer->deserialize(
//                 $request->getContent(),
//                 Book::class,
//                 'json'
//             );

//             $this->entityManager->persist($book);
//             $this->entityManager->flush();

//             return $this->json([
//                 'message' => 'Livre créé avec succès',
//                 'data' => $book
//             ], 201, [], ['groups' => 'book:read']);
//         } catch (\Exception $e) {
//             return $this->json([
//                 'message' => 'Données invalides',
//                 'error' => $e->getMessage()
//             ], 400);
//         }
//     }
//     #[Route('/books/{id}', name: 'books_update', methods: ['PATCH'])]
// public function update(Book $book, Request $request): JsonResponse
// {
//     try {
//         $this->serializer->deserialize(
//             $request->getContent(),
//             Book::class,
//             'json',
//                 ['object_to_populate' => $book] //permet de mettre à jour l'objet existant plutôt que d'en créer un nouveau
//         );
    
//         $this->entityManager->flush();
    
//         return $this->json([
//             'message' => 'Livre mis à jour avec succès',
//             'data' => $book
//         ], context: ['groups' => 'book:read']);
//     } catch (\Exception $e) {
//         return $this->json([
//             'message' => 'Données invalides',
//             'error' => $e->getMessage()
//         ], 400);
//     }
// }

// #[Route('/books/{id}', name: 'books_delete', methods: ['DELETE'])]
//     public function delete(Book $book): JsonResponse
//     {
//         try {
//             $this->entityManager->remove($book);
//             $this->entityManager->flush();

//             return $this->json([
//                 'message' => 'Livre supprimé avec succès'
//             ]);
//         } catch (\Exception $e) {
//             return $this->json([
//                 'message' => 'Erreur lors de la suppression',
//                 'error' => $e->getMessage()
//             ], 400);
//         }
//     }
// }
