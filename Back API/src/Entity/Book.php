<?php

namespace App\Entity;

use App\Repository\BookRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use App\DataPersister\BookDataPersister;
use Symfony\Component\Serializer\Attribute\MaxDepth;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;
#[ORM\Entity(repositoryClass: BookRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            normalizationContext: ['groups' => ['book:read']],
            security: "is_granted('PUBLIC_ACCESS')"
        ),
        new GetCollection(
            normalizationContext: ['groups' => ['book:read']],
            security: "is_granted('PUBLIC_ACCESS')"
        ),
        new Post(
            denormalizationContext: ['groups' => ['book:write']],
            security: "is_granted('ROLE_VENDEUR')",
            processor: BookDataPersister::class,
            securityMessage: "Seuls les vendeurs connectés peuvent créer des livres",
            inputFormats: ['multipart' => ['multipart/form-data']]
        ),
        new Patch(
            denormalizationContext: ['groups' => ['book:write']],
            security: "is_granted('BOOK_EDIT', object)",
            securityMessage: "Vous ne pouvez modifier que vos propres livres"
        ),
        new Delete(
            security: "is_granted('BOOK_DELETE', object)",
            securityMessage: "Vous ne pouvez supprimer que vos propres livres"
        ),
    ]
)]
#[Groups(['book:read'])]
#[Vich\Uploadable]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['book:read'])]
    private ?int $id = null;


    #[ORM\Column(length: 255)]
    #[Groups(['book:read', 'book:write'])]
    private ?string $title = null;

    #[ORM\ManyToMany(targetEntity: Genre::class, inversedBy: 'books')]
    #[Groups(['book:read', 'book:write'])]
    private Collection $genre;

   
    public function __construct()
    {
        $this->genre = new ArrayCollection();
    }

    #[ORM\ManyToOne(inversedBy: 'books')]
    #[ORM\JoinColumn(nullable: false)]
    #[MaxDepth(1)]
    private ?User $user = null;

    #[ORM\Column]
    #[Groups(['book:read', 'book:write'])]
    private ?int $prix = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['book:read', 'book:write'])]
    private ?string $description = null;

    #[Vich\UploadableField(mapping: 'book_image', fileNameProperty: 'image')]
    #[Groups(['book:write'])]
    private ?File $imageFile = null; // Champ temporaire pour l'upload

    #[ORM\Column(length: 255)]
    #[Groups(['book:read'])]
    private ?string $image = null;

    #[ORM\ManyToOne(targetEntity: Auteur::class,inversedBy: 'books')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['book:read', 'book:write'])]
    private ?Auteur $auteur = null;

    #[ORM\ManyToOne(targetEntity: Etat::class,inversedBy: 'books')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['book:read', 'book:write'])]
    private ?Etat $etat = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }


    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getPrix(): ?int
    {
        return $this->prix;
    }

    public function setPrix(int $prix): static
    {
        $this->prix = $prix;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function setImageFile(?File $imageFile): self
    {
        $this->imageFile = $imageFile;
        return $this;
    }
    public function getAuteur(): ?Auteur
    {
        return $this->auteur;
    }

    public function setAuteur(?Auteur $auteur): static
    {
        $this->auteur = $auteur;

        return $this;
    }

    public function getEtat(): ?Etat
    {
        return $this->etat;
    }

    public function setEtat(?Etat $etat): static
    {
        $this->etat = $etat;

        return $this;
    }


     /**
     * Get the genres associated with the book.
     *
     * @return Collection|Genre[]
     */
    public function getGenre(): Collection
    {
        return $this->genre;
    }

    /**
     * Set the genres associated with the book.
     *
     * @param Collection|Genre[] $genre
     * @return $this
     */
    public function setGenre(Collection $genre): self
    {
        $this->genre = $genre;

        return $this;
    }

    /**
     * Add a genre to the book.
     *
     * @param Genre $genre
     * @return $this
     */
    public function addGenre(Genre $genre): self
    {
        // Prevent adding the same genre multiple times
        if (!$this->genre->contains($genre)) {
            $this->genre[] = $genre;
        }

        return $this;
    }

    /**
     * Remove a genre from the book.
     *
     * @param Genre $genre
     * @return $this
     */
    public function removeGenre(Genre $genre): self
    {
        $this->genre->removeElement($genre);

        return $this;
    }

    /**
 * Retourne les IDs des genres associés au livre.
 */
public function getGenreIds(): array
{
    return array_map(fn(Genre $genre) => $genre->getId(), $this->genre->toArray());
}
}
