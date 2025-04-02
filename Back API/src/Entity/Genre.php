<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\GenreRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;

use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GenreRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            normalizationContext: ['groups' => ['genre:read']],
            security: "is_granted('PUBLIC_ACCESS')"
        ),
        new GetCollection(
            normalizationContext: ['groups' => ['genre:read']],
            security: "is_granted('PUBLIC_ACCESS')"
        ),
    ]
)]
class Genre
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['genre:read', 'book:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['genre:read', 'genre:write', 'book:read'])]
    private ?string $name = null;

    #[ORM\ManyToMany(targetEntity: Book::class, mappedBy: 'genre')]
    #[Groups(['genre:read'])]
    private Collection $books;
    public function __construct()
    {
        $this->books = new ArrayCollection();
    }
    
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }


    public function getBooks(): Collection
{
    return $this->books;
}

/**
 * Retourne les IDs des livres associés au genre.
 */
public function getBookIds(): array
{
    return array_map(fn(Book $book) => $book->getId(), $this->books->toArray());
}
    public function addBook(Book $book): self
{
    if (!$this->books->contains($book)) {
        $this->books->add($book);
        $book->addGenre($this); // Assure la cohérence des relations
    }

    return $this;
}

public function removeBook(Book $book): self
{
    if ($this->books->removeElement($book)) {
        $book->removeGenre($this); // Assure la cohérence des relations
    }

    return $this;
}
}
