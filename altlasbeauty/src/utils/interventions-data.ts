export type Operation = {
    title: string;
    description: string;
    image: string;
  };
  
  export type InterventionDetail = {
    slug: string;
    name: string;
    operations: Operation[];
  };
  
  export const interventions: InterventionDetail[] = [
    {
      slug: 'visage',
      name: 'Chirurgie du visage',
      operations: [
        {
          title: 'Lifting cervico-facial',
          description: "Au fil des années, les traits du visage et du cou se courbent en donnant un air triste et un aspect vieilli au visage. Le lifting cervico-facial sert à réguler les traits de votre visage, en traitant le relâchement de la peau et les rides pour restaurer l'éclat de jeunesse.",
          image: '/visage/gauche1-17.jpg.webp',
        },
        {
          title: 'Blépharoplastie',
          description: "La Blépharoplastie corrige l'affaissement des paupières et retire l'excès de peau pour rajeunir et illuminer le regard.",
          image: '/visage/blépharoplastie.jpg.webp',
        },
        {
          title: 'Rhinoplastie',
          description: "La rhinoplastie permet de corriger les défauts du nez (bosses, déviations, largeur) pour un visage plus harmonieux.",
          image: '/visage/rhino.png',
        },
        {
          title: 'Lipofilling du visage',
          description: "Le lipofilling facial restaure les volumes du visage en injectant la propre graisse du patient pour un effet naturel.",
          image: '/visage/visage4.png',
        },
        {
          title: 'Otoplastie',
          description: "La chirurgie des oreilles décollées vise à repositionner et à corriger la forme des oreilles pour un aspect naturel et symétrique.",
          image: '/visage/visage3.png',
        },
      ],
    },
    {
      slug: 'mammaire',
      name: 'Chirurgie mammaire',
      operations: [
        {
          title: 'Augmentation mammaire',
          description: "Pose de prothèses ou lipofilling pour augmenter le volume des seins et obtenir une poitrine harmonieuse.",
          image: '/poitrine/droite1-13.jpg.webp',
        },
        {
          title: 'Réduction mammaire',
          description: "Réduction du volume des seins pour soulager les douleurs dorsales et obtenir une silhouette équilibrée.",
          image: '/poitrine/gauche1-11.jpg.webp',
        },
        {
          title: 'Lifting mammaire',
          description: "Correction de la ptose mammaire (seins tombants) pour remonter la poitrine et retrouver sa fermeté.",
          image: '/poitrine/poitrine.webp',
        },
        {
          title: 'Reconstruction mammaire',
          description: "Reconstruction du sein après une mastectomie pour redonner une forme naturelle et harmonieuse.",
          image: '/poitrine/poitrine2.jpg',
        },
      ],
    },
    {
      slug: 'corps',
      name: 'Chirurgie du corps',
      operations: [
        {
          title: 'Liposuccion',
          description: "Élimination des amas graisseux localisés pour affiner la silhouette et améliorer les contours du corps.",
          image: '/corps/corps.webp',
        },
        {
          title: 'Abdominoplastie',
          description: "Retrait de l'excès de peau et de graisse au niveau du ventre, avec raffermissement des muscles abdominaux.",
          image: '/corps/corps0.jpg',
        },
        {
          title: 'Lifting des bras',
          description: "Suppression de l'excédent cutané au niveau des bras pour un galbe plus ferme et rajeuni.",
          image: '/corps/bras.jpg',
        },
        {
          title: 'Lifting des cuisses',
          description: "Affinement et raffermissement des cuisses après perte de poids ou vieillissement cutané.",
          image: '/corps/corps3.jpg',
        },
        {
          title: 'Bodylift',
          description: "Chirurgie globale après amaigrissement massif, pour redessiner le ventre, les fesses et les cuisses.",
          image: '/corps/homme.jpg',
        },
        {
          title: 'Lipofilling des fesses',
          description: "Augmentation naturelle du volume des fesses grâce à la réinjection de la graisse corporelle.",
          image: '/corps/corpsF4.jpg',
        },
        {
          title: 'Correction des mollets',
          description: "Pose d'implants ou lipofilling pour redéfinir la forme et le galbe des mollets.",
          image: '/corps/corps1.jpg',
        },
        {
          title: 'Correction des poignées d’amour',
          description: "Sculpter la taille en supprimant les bourrelets latéraux grâce à une lipoaspiration ciblée.",
          image: '/corps/corps2.jpg',
        },
      ],
    },
    {
      slug: 'dentaire',
      name: 'Chirurgie dentaire',
      operations: [
        {
          title: 'Blanchiment dentaire',
          description: "Technique esthétique pour éclaircir la teinte des dents et obtenir un sourire éclatant.",
          image: '/dent/dent2.webp',
        },
        {
          title: 'Implants dentaires',
          description: "Remplacement d'une ou plusieurs dents manquantes par des implants solides et esthétiques.",
          image: '/dent/dent3.jpg',
        },
        {
          title: 'Facettes dentaires',
          description: "Pose de fines coques en céramique pour corriger les défauts esthétiques des dents.",
          image: '/dent/dent.webp',
        },
      ],
    },
    {
      slug: 'cheveux',
      name: 'Greffe de cheveux',
      operations: [
        {
          title: 'Greffe FUE',
          description: "Méthode d'extraction unitaire pour une greffe capillaire discrète et sans cicatrices visibles.",
          image: '/greffe/gauche1-10.jpg.webp',
        },
        {
          title: 'Greffe FUT',
          description: "Méthode de bandelette pour couvrir des surfaces importantes de calvitie.",
          image: '/greffe/greffe.png',
        },
        {
          title: 'Traitement PRP',
          description: "Injections de plasma riche en plaquettes pour stimuler la repousse naturelle des cheveux.",
          image: '/greffe/greffe_avant-apres.png',
        },
      ],
    },
    {
      slug: 'soin',
      name: 'Soin esthétique',
      operations: [
        {
          title: 'Peeling',
          description: "Technique de renouvellement cellulaire pour traiter les imperfections, rides et taches.",
          image: '/soins/peeling.jpg',
        },
        {
          title: 'Botox',
          description: "Injections de toxine botulique pour atténuer les rides du front, des yeux et de la bouche.",
          image: '/soins/visage2.png',
        },
        {
          title: 'Acide hyaluronique',
          description: "Injection de gel pour restaurer les volumes et combler les rides profondes.",
          image: '/soins/soins_avant-apres.png',
        },
      ],
    },
  ];
  