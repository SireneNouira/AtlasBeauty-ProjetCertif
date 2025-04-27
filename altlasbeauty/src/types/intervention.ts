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
  