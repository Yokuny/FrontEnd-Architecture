import AccordionTabs1 from '@/components/accordion-tabs-1';
import CardStandard4 from '@/components/card-standard-4';
import EmptyStandard5 from '@/components/empty-standard-5';

export function ContentTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <AccordionTabs1 />
        <EmptyStandard5 />
      </div>
      <div className="space-y-6">
        <CardStandard4 />
      </div>
    </div>
  );
}
