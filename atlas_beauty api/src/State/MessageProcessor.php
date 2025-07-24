<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Message;
use App\Entity\Patient;
use App\Entity\User;
use App\Service\MercurePublisher;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class MessageProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $persistProcessor,
        private MercurePublisher $publisher,
        private EntityManagerInterface $em
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

        if ($sender = $message->getSenderUser()) {
            $topics[] = "http://example.com/chat/user-{$sender->getId()}";
        } elseif ($sender = $message->getSenderPatient()) {
            $topics[] = "http://example.com/chat/patient-{$sender->getId()}";
        }

        if ($receiver = $message->getReceiverUser()) {
            $topics[] = "http://example.com/chat/user-{$receiver->getId()}";
        } elseif ($receiver = $message->getReceiverPatient()) {
            $topics[] = "http://example.com/chat/patient-{$receiver->getId()}";
        }
        $data = [
            '@id' => '/api/messages/' . $message->getId(),
            '@type' => 'Message',
            'id' => $message->getId(),
            'content' => $message->getContent(),
            'createdAt' => $message->getCreatedAt()->format(\DateTimeInterface::ATOM),
            'sender' => [
                '@id' => $message->getSenderUser()
                    ? '/api/users/' . $message->getSenderUser()->getId()
                    : '/api/patients/' . $message->getSenderPatient()->getId(),
                'id' => $message->getSenderUser()
                    ? $message->getSenderUser()->getId()
                    : $message->getSenderPatient()->getId(),
                'type' => $message->getSenderUser() ? 'user' : 'patient'
            ]
        ];

        foreach (array_unique($topics) as $topic) {
            $this->publisher->publish($topic, $data);
        }
    }
}
