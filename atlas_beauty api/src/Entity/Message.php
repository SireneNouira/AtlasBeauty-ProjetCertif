<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Entity\Patient;
use App\Entity\User;
use App\State\MessageProcessor;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Mercure\Attribute\Publish;



#[ORM\Entity]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(
            processor: MessageProcessor::class, // Nous allons créer ce processeur
            mercure: [
                'topics' => [
                    // 'http://example.com/messages/{receiverUser}/{receiverPatient}', // Nous allons gérer cela dynamiquement
                    // 'http://example.com/messages/{senderUser}/{senderPatient}'
                    '/api/messages/{id}',
                    '/chat/user/{receiverUser.id}',
                    '/chat/patient/{senderPatient.id}'
                ]
            ]
        )
    ],
    normalizationContext: ['groups' => ['message:read']],
    denormalizationContext: ['groups' => ['message:write']]
)]
class Message
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    #[Groups(['message:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['message:read', 'message:write'])]
    private ?string $content = null;

    #[ORM\Column]
    #[Groups(['message:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(targetEntity: User::class)] // Retirez cascade persist
    #[Groups(['message:read', 'message:write'])]
    private ?User $receiverUser = null;
    
    #[ORM\ManyToOne(targetEntity: User::class)] // Retirez cascade persist
    #[Groups(['message:read', 'message:write'])]
    private ?User $senderUser = null;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[Groups(['message:read', 'message:write'])]
    private ?Patient $senderPatient = null;


    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[Groups(['message:read', 'message:write'])]
    private ?Patient $receiverPatient = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    
    public function getContent(): ?string
    {
        return $this->content;
    }
    
    public function setContent(?string $content): self
    {
        $this->content = $content;
        return $this;
    }
    
    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
    
    public function getSenderUser(): ?User
    {
        return $this->senderUser;
    }
    
    public function setSenderUser(?User $senderUser): self
    {
        $this->senderUser = $senderUser;
        return $this;
    }
    
    public function getSenderPatient(): ?Patient
    {
        return $this->senderPatient;
    }
    
    public function setSenderPatient(?Patient $senderPatient): self
    {
        $this->senderPatient = $senderPatient;
        return $this;
    }
    
    public function getReceiverUser(): ?User
    {
        return $this->receiverUser;
    }
    
    public function setReceiverUser(?User $receiverUser): self
    {
        $this->receiverUser = $receiverUser;
        return $this;
    }
    
    public function getReceiverPatient(): ?Patient
    {
        return $this->receiverPatient;
    }
    
    public function setReceiverPatient(?Patient $receiverPatient): self
    {
        $this->receiverPatient = $receiverPatient;
        return $this;
    }
}
