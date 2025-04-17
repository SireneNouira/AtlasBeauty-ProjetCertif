<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Message;
use App\Entity\Patient;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class MessageProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $persistProcessor,
        private HubInterface $hub,
        private EntityManagerInterface $em // Ajouté
    ) {}

    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        // Gestion des relations
        $this->handleRelations($data);
        
        // Persistence
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        
        // Mercure
        if ($data instanceof Message) {
            $this->publishMercureUpdate($data);
        }
        
        return $result;
    }
    private function extractIdFromIri(string $iri): ?int
    {
        $parts = explode('/', $iri);
        return (int) end($parts);
    }
    private function handleRelations(Message $message): void
    {
        if ($message->getReceiverUser() && $message->getReceiverUser()->getId()) {
            $message->setReceiverUser(
                $this->em->getReference(
                    User::class, 
                    $message->getReceiverUser()->getId()
                )
            );
        }
    
        if ($message->getSenderUser() && $message->getSenderUser()->getId()) {
            $message->setSenderUser(
                $this->em->getReference(
                    User::class, 
                    $message->getSenderUser()->getId()
                )
            );
        }
    
        // Même logique pour Patient
        if ($message->getReceiverPatient() && $message->getReceiverPatient()->getId()) {
            $message->setReceiverPatient(
                $this->em->getReference(
                    Patient::class, 
                    $message->getReceiverPatient()->getId()
                )
            );
        }
    
        if ($message->getSenderPatient() && $message->getSenderPatient()->getId()) {
            $message->setSenderPatient(
                $this->em->getReference(
                    Patient::class, 
                    $message->getSenderPatient()->getId()
                )
            );
        }
    }
    private function publishMercureUpdate(Message $message): void
    {
        $topics = [];
        
        if ($receiver = $message->getReceiverUser()) {
            $topics[] = "http://example.com/messages/user/{$receiver->getId()}";
        } 
        elseif ($receiver = $message->getReceiverPatient()) {
            $topics[] = "http://example.com/messages/patient/{$receiver->getId()}";
        }

        $update = new Update(
            $topics,
            json_encode([
                'id' => $message->getId(),
                'content' => $message->getContent(),
                'createdAt' => $message->getCreatedAt()->format(\DateTimeInterface::ATOM),
                'sender' => $message->getSenderUser() ? [
                    'id' => $message->getSenderUser()->getId(),
                    'type' => 'user'
                ] : [
                    'id' => $message->getSenderPatient()->getId(),
                    'type' => 'patient'
                ]
            ])
        );
        
        $this->hub->publish($update);
    }
}