<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\DataPersister\UserDataPersister;
use App\Dto\RegisterUserDto;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\DiscriminatorColumn;
use Doctrine\ORM\Mapping\DiscriminatorMap;
use Doctrine\ORM\Mapping\InheritanceType;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use App\State\Provider\MeProvider;


#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\InheritanceType("SINGLE_TABLE")]
#[ORM\DiscriminatorColumn(name: "discriminator", type: "string")]
#[ORM\DiscriminatorMap(["user" => User::class, "vendeur" => Vendeur::class])]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ApiResource(
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
    operations: [
        new Post(
            uriTemplate: '/register',
            input: RegisterUserDto::class,
            denormalizationContext: ['groups' => ['user:write']],
            normalizationContext: ['groups' => ['user:read']],  // Ajouté pour bien gérer l'affichage
            validationContext: ['groups' => ['Default']],
            security: "is_granted('PUBLIC_ACCESS')",
            processor: UserDataPersister::class
        ),
        new Get(
            uriTemplate: '/me',
            denormalizationContext: ['groups' => ['user:write']],
            normalizationContext: ['groups' => ['user:read']],
            security: 'is_granted("USER_VIEW", object)', 
            securityMessage: "Seule les utilisateurs peuvent voir leurs informations",
            provider: MeProvider::class
        ),
        new Patch(
            denormalizationContext: ['groups' => ['user:write']],
            security: "is_granted('USER_EDIT', object)",
            securityMessage: "Vous ne pouvez modifier que vos propres nformations",
            processor: UserDataPersister::class
        ),
        new Delete(
            security: "is_granted('USER_DELETE', object)",
            securityMessage: "Vous ne pouvez supprimer que votre compte"
        ),
    ]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['user:write', 'user:read'])]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(['user:write'])]
    private ?string $password = null;

    /**
     * @var Collection<int, Book>
     */
    #[ORM\OneToMany(targetEntity: Book::class, mappedBy: 'user')]
    private Collection $books;



    #[ORM\Column(length: 255)]
    #[Groups(['user:write', 'user:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:write', 'user:read'])]
    private ?string $prenom = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:write', 'user:read'])]
    private ?string $telephone = null;

    public function __construct()
    {
        $this->books = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Book>
     */
    public function getBooks(): Collection
    {
        return $this->books;
    }

    public function addBook(Book $book): static
    {
        if (!$this->books->contains($book)) {
            $this->books->add($book);
            $book->setUser($this);
        }

        return $this;
    }

    public function removeBook(Book $book): static
    {
        if ($this->books->removeElement($book)) {
            // set the owning side to null (unless already changed)
            if ($book->getUser() === $this) {
                $book->setUser(null);
            }
        }

        return $this;
    }


    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }
}
