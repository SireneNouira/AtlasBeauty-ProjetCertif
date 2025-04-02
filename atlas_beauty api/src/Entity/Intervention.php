<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\InterventionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: InterventionRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['demandeDevis:read']],
    // operations: [
    //     'get' => ['security' => "is_granted('PUBLIC_ACCESS')"],
    //     'post' => ['security' => "is_granted('ROLE_ADMIN')"],
    //     'put' => ['security' => "is_granted('ROLE_ADMIN')"],
    //     'delete' => ['security' => "is_granted('ROLE_ADMIN')"]
    // ]
)]
class Intervention
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups([ 'demandeDevis:read'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, DemandeDevis>
     */
    #[ORM\OneToMany(targetEntity: DemandeDevis::class, mappedBy: 'intervention_1')]
    private Collection $demandeDevis;

    public function __construct()
    {
        $this->demandeDevis = new ArrayCollection();
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

    /**
     * @return Collection<int, DemandeDevis>
     */
    public function getDemandeDevis(): Collection
    {
        return $this->demandeDevis;
    }

    public function addDemandeDevis(DemandeDevis $demandeDevis): static
    {
        if (!$this->demandeDevis->contains($demandeDevis)) {
            $this->demandeDevis->add($demandeDevis);
            $demandeDevis->setIntervention1($this);
        }

        return $this;
    }

    public function removeDemandeDevis(DemandeDevis $demandeDevis): static
    {
        if ($this->demandeDevis->removeElement($demandeDevis)) {
            // set the owning side to null (unless already changed)
            if ($demandeDevis->getIntervention1() === $this) {
                $demandeDevis->setIntervention1(null);
            }
        }

        return $this;
    }


}
