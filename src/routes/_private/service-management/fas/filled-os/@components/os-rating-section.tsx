import { useTranslation } from 'react-i18next';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import type { FasOrderDetails } from '../@interface/os.schema';

interface OsRatingSectionProps {
  data: FasOrderDetails | undefined;
}

export function OsRatingSection({ data }: OsRatingSectionProps) {
  const { t } = useTranslation();

  if (!data?.rating) return null;

  return (
    <div className="space-y-4">
      <ItemDescription className="font-semibold">{t('fas.rate.data')}</ItemDescription>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Rating */}
        <div>
          <ItemDescription>{t('fas.rating')}</ItemDescription>
          <ItemTitle>{data.rating}</ItemTitle>
        </div>

        {/* Rating Description */}
        {data.ratingDescription && (
          <div className="md:col-span-2 lg:col-span-3">
            <ItemDescription>{t('fas.rating.justification')}</ItemDescription>
            <ItemTitle className="whitespace-pre-wrap">{data.ratingDescription}</ItemTitle>
          </div>
        )}

        {/* Partial Execution */}
        {data.partial && (
          <div className="md:col-span-2 lg:col-span-4">
            <ItemDescription>{t('fas.rating.partial')}</ItemDescription>
            <ItemTitle className="whitespace-pre-wrap">{data.partial}</ItemTitle>
          </div>
        )}
      </div>

      {/* Questions */}
      {data.questions && Object.keys(data.questions).length > 0 && (
        <div className="space-y-4">
          <ItemDescription className="font-semibold">{t('fas.rating.questions')}</ItemDescription>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Object.entries(data.questions).map(([question, answer]) => (
              <div key={question} className="rounded-lg border p-4">
                <ItemDescription>{question}</ItemDescription>
                <ItemTitle>{answer?.value || '-'}</ItemTitle>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
