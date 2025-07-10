<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

//    /**
//     * @return Message[] Returns an array of Message objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Message
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
// src/Repository/MessageRepository.php

public function findConversation($assistantId, $patientId)
{
    return $this->createQueryBuilder('m')
        ->where('
            (m.senderUser = :assistantId AND m.receiverPatient = :patientId)
            OR
            (m.senderPatient = :patientId AND m.receiverUser = :assistantId)
        ')
        ->setParameter('assistantId', $assistantId)
        ->setParameter('patientId', $patientId)
        ->orderBy('m.createdAt', 'ASC')
        ->getQuery()
        ->getResult();
}

}
