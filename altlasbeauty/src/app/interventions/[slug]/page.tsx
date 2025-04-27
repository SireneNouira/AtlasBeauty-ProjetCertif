import { interventions } from '@/utils/interventions-data';
import DetailIntervention from '@/components/DetailIntervention';
import CarouselAvantApres from '@/components/CarouselAvantApres';
import SocialSidebar from '@/components/common/SocialSidebar';

type Params = {
  slug: string;
};

export default function InterventionPage({ params }: { params: Params }) {
  const intervention = interventions.find((i) => i.slug === params.slug);

  if (!intervention) {
    return <div className="text-center py-20 text-2xl">Intervention non trouvée</div>;
  }

  return (
    <section className="py-10">
      <DetailIntervention intervention={intervention} />

        {/* Partie en bas : carrousel + sidebar */}
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-6 gap-10 mt-20">
        <div className="md:w-2/3">
          <CarouselAvantApres slug={params.slug} />
        </div>
        <div className="md:w-1/3">
          <SocialSidebar />
        </div>
      </div>
    </section>
  );
}
