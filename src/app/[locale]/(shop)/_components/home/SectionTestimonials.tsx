import { homeTestimonialsData } from '@/app/[locale]/(shop)/_lib/data/home';
import { SectionHeading } from '@/shared/components/marketing/SectionHeading';
import { TestimonialCard } from '@/shared/components/marketing/TestimonialCard';

export const SectionTestimonials = (): React.JSX.Element => {
  return (
    <section className="bg-neutral-50/70 dark:bg-neutral-900/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <SectionHeading title="Khách hàng nói gì?" align="center" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeTestimonialsData.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
              quote={testimonial.quote}
              meta={testimonial.meta}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
