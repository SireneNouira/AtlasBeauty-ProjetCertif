<?php

namespace App\Controller\Admin;

use App\Entity\User;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserCrudController extends AbstractCrudController
{
    public function __construct(private UserPasswordHasherInterface $passwordHasher)
    {
    }

    public static function getEntityFqcn(): string
    {
        return User::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Utilisateur')
            ->setEntityLabelInPlural('Utilisateurs');
    }

    public function configureFields(string $pageName): iterable
    {
        yield EmailField::new('email', 'Email');
        
        yield TextField::new('plainPassword', 'Mot de passe')
            ->onlyOnForms()
            ->setRequired($pageName === Crud::PAGE_NEW);
        
        yield ChoiceField::new('roles', 'Rôles')
            ->allowMultipleChoices()
            ->renderExpanded()
            ->setChoices([
                'Administrateur' => 'ROLE_ADMIN',
                'Assistant' => 'ROLE_ASSISTANT',
                'Utilisateur' => 'ROLE_USER',
            ])
            ->setFormTypeOption('choice_attr', function($choice, $key, $value) {
                return ['class' => 'form-check-input'];
            });
        
        yield BooleanField::new('isVerified', 'Email vérifié');
    }

    public function persistEntity($entityManager, $user): void
    {
        if ($user->getPlainPassword()) {
            $user->setPassword(
                $this->passwordHasher->hashPassword(
                    $user,
                    $user->getPlainPassword()
                )
            );
        }

        parent::persistEntity($entityManager, $user);
    }
}