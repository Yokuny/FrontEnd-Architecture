import { HelpCircle, Star } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import type { FasOrderDetails } from '../@interface/os.schema';

export function OsRating({ data }: OsRatingSectionProps) {
  const { t } = useTranslation();

  if (!data?.rating) return null;

  interface SpecItem {
    label: string;
    value: React.ReactNode;
    fullWidth?: boolean;
  }

  interface SpecCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    specs: SpecItem[];
  }

  const categories: SpecCategory[] = [
    {
      id: 'rating-data',
      name: t('fas.rate.data'),
      icon: <Star className="size-4" />,
      specs: [
        { label: t('fas.rating'), value: data.rating ? t(data.rating) : '-' },
        ...(data.ratingDescription
          ? [
              {
                label: t('fas.rating.justification'),
                value: <div className="whitespace-pre-wrap">{data.ratingDescription}</div>,
              },
            ]
          : []),
        ...(data.partial
          ? [
              {
                label: t('fas.rating.partial'),
                value: <div className="whitespace-pre-wrap">{t(data.partial)}</div>,
              },
            ]
          : []),
      ],
    },
    ...(data.questions && Object.keys(data.questions).length > 0
      ? [
          {
            id: 'questions',
            name: t('fas.rating.questions'),
            icon: <HelpCircle className="size-4" />,
            specs: Object.entries(data.questions).map(([question, answer]) => ({
              label: t(question),
              value: answer?.value ? t(answer.value) : '-',
              fullWidth: true,
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableBody>
          {categories.map((category) => {
            const normalSpecs = category.specs.filter((s) => !s.fullWidth);
            const fullWidthSpecs = category.specs.filter((s) => s.fullWidth);
            const hasNormalRow = normalSpecs.length > 0;
            const totalRows = (hasNormalRow ? 1 : 0) + fullWidthSpecs.length;

            return (
              <React.Fragment key={category.id}>
                {/* Main Row / Normal Specs Row */}
                {hasNormalRow && (
                  <TableRow className="border-t">
                    <TableCell className="w-60 bg-muted/50 py-4 align-top font-medium" rowSpan={totalRows}>
                      <div className="flex items-center gap-1">
                        <ItemMedia variant="icon">{category.icon}</ItemMedia>
                        <ItemTitle>{category.name}</ItemTitle>
                      </div>
                    </TableCell>
                    {normalSpecs.map((spec) => (
                      <TableCell key={spec.label} className="py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <ItemDescription>{spec.label}</ItemDescription>
                          <ItemTitle>{spec.value}</ItemTitle>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                )}

                {/* Full Width Specs (like Questions or long justifications) */}
                {fullWidthSpecs.map((spec, index) => (
                  <TableRow key={spec.label} className="border-t">
                    {!hasNormalRow && index === 0 && (
                      <TableCell className="w-60 bg-muted/50 py-4 align-top font-medium" rowSpan={totalRows}>
                        <div className="flex items-center gap-1">
                          <ItemMedia variant="icon">{category.icon}</ItemMedia>
                          <ItemTitle>{category.name}</ItemTitle>
                        </div>
                      </TableCell>
                    )}
                    <TableCell colSpan={hasNormalRow ? normalSpecs.length : 3} className="py-4 align-top">
                      <div className="flex flex-col gap-1">
                        <ItemDescription>{spec.label}</ItemDescription>
                        <ItemTitle>{spec.value}</ItemTitle>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

interface OsRatingSectionProps {
  data: FasOrderDetails | undefined;
}
