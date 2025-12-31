import React from 'react';
import { Separator } from '@/components/ui/separator';

interface FormSection {
  title: string;
  description?: string;
  fields: React.ReactNode[];
}

interface DefaultFormLayoutProps {
  sections: FormSection[];
  footer?: React.ReactNode;
}

export default function DefaultFormLayout({ sections, footer }: DefaultFormLayoutProps) {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {sections.map((section, index) => (
          <React.Fragment key={section.title}>
            <div className="md:col-span-1">
              <h2 className="font-semibold text-foreground">{section.title}</h2>
              {section.description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{section.description}</p>}
            </div>
            <div className="sm:max-w-3xl md:col-span-2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                {section.fields.map((field, fIndex) => (
                  <div key={fIndex} className="col-span-full">
                    {field}
                  </div>
                ))}
              </div>
            </div>
            {index < sections.length - 1 && (
              <div className="col-span-full">
                <Separator className="my-2" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {footer && (
        <>
          <Separator className="my-4" />
          <div className="flex items-center justify-end space-x-4">{footer}</div>
        </>
      )}
    </div>
  );
}
