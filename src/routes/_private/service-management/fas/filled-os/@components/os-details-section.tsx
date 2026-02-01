import { useTranslation } from 'react-i18next';
import { ItemDescription, ItemTitle } from '@/components/ui/item';
import { formatDate } from '@/lib/formatDate';
import type { FasOrderDetails } from '../@interface/os.schema';

interface OsDetailsSectionProps {
  data: FasOrderDetails | undefined;
}

export function OsDetailsSection({ data }: OsDetailsSectionProps) {
  const { t } = useTranslation();

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* OS Name */}
      <div>
        <ItemDescription>{t('os')}</ItemDescription>
        <ItemTitle>{data.name}</ItemTitle>
      </div>

      {/* Vessel */}
      <div>
        <ItemDescription>{t('vessel')}</ItemDescription>
        <ItemTitle>{data.fasHeader?.vessel?.name || '-'}</ItemTitle>
      </div>

      {/* Type */}
      <div>
        <ItemDescription>{t('type')}</ItemDescription>
        <ItemTitle>{data.fasHeader?.type || '-'}</ItemTitle>
      </div>

      {/* Service Date */}
      <div>
        <ItemDescription>{t('service.date')}</ItemDescription>
        <ItemTitle>{data.fasHeader?.serviceDate ? formatDate(data.fasHeader.serviceDate, 'dd MMM yyyy HH:mm') : '-'}</ItemTitle>
      </div>

      {/* Local */}
      <div>
        <ItemDescription>{t('local')}</ItemDescription>
        <ItemTitle>{data.fasHeader?.local || '-'}</ItemTitle>
      </div>

      {/* Team Change */}
      <div>
        <ItemDescription>{t('event.team.change')}</ItemDescription>
        <ItemTitle>{t(data.fasHeader?.teamChange ? 'yes' : 'not')}</ItemTitle>
      </div>

      {/* Description - Full Width */}
      <div className="md:col-span-2 lg:col-span-4">
        <ItemDescription>{t('description')}</ItemDescription>
        <ItemTitle className="whitespace-pre-wrap">{data.description || '-'}</ItemTitle>
      </div>

      {/* Material FAS */}
      <div>
        <ItemDescription>{t('materialFas.label')}</ItemDescription>
        <ItemTitle>{data.materialFas || '-'}</ItemTitle>
      </div>

      {/* Material FAS Code */}
      <div>
        <ItemDescription>{t('materialFas.code.label')}</ItemDescription>
        <ItemTitle>{data.materialFasCode || '-'}</ItemTitle>
      </div>

      {/* Onboard Material */}
      <div>
        <ItemDescription>{t('onboardMaterialFas.label')}</ItemDescription>
        <ItemTitle>{data.onboardMaterial || '-'}</ItemTitle>
      </div>

      {/* RMRB */}
      <div>
        <ItemDescription>{t('rmrbFas.label')}</ItemDescription>
        <ItemTitle>{data.rmrb || '-'}</ItemTitle>
      </div>

      {/* RMRB Code */}
      <div>
        <ItemDescription>{t('rmrbFas.code.label')}</ItemDescription>
        <ItemTitle>{data.rmrbCode || '-'}</ItemTitle>
      </div>

      {/* JOB */}
      {data.job && (
        <div>
          <ItemDescription>JOB</ItemDescription>
          <ItemTitle>{data.job}</ItemTitle>
        </div>
      )}

      {/* Request Order */}
      {data.requestOrder && (
        <div className="md:col-span-2 lg:col-span-4">
          <ItemDescription>{t('add.request')}</ItemDescription>
          <ItemTitle>{data.requestOrder}</ItemTitle>
        </div>
      )}

      {/* VOR */}
      {data.vor && (
        <div className="md:col-span-2 lg:col-span-4">
          <ItemDescription>VOR</ItemDescription>
          <ItemTitle>{data.vor}</ItemTitle>
        </div>
      )}

      {/* Supplier Data */}
      {data.supplierData && !data.supplierData.cancelled && data.supplierData.codigoFornecedor && (
        <>
          <div>
            <ItemDescription>{t('supplier.code.label')}</ItemDescription>
            <ItemTitle>{data.supplierData.codigoFornecedor}</ItemTitle>
          </div>
          <div>
            <ItemDescription>{t('supplier.name.label')}</ItemDescription>
            <ItemTitle>{data.supplierData.razao || '-'}</ItemTitle>
          </div>
          {data.supplierData.emails && data.supplierData.emails.length > 0 && (
            <div>
              <ItemDescription>{t('supplier.email.label')}</ItemDescription>
              <div className="space-y-1">
                {data.supplierData.emails.map((email) => (
                  <ItemTitle key={email}>{email}</ItemTitle>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Insurance */}
      {data.state !== 'awaiting.create.confirm' && (
        <>
          <div>
            <ItemDescription>{t('insurance.work.order')}</ItemDescription>
            <ItemTitle>{t(data.osInsurance ? 'yes' : 'not')}</ItemTitle>
          </div>
          <div>
            <ItemDescription>{t('downtime.work.order')}</ItemDescription>
            <ItemTitle>{t(data.osDowntime ? 'yes' : 'not')}</ItemTitle>
          </div>
        </>
      )}

      {/* Observation */}
      {data.confirmObservation && data.state !== 'awaiting.create.confirm' && (
        <div className="md:col-span-2 lg:col-span-4">
          <ItemDescription>{t('observation')}</ItemDescription>
          <ItemTitle className="whitespace-pre-wrap">{data.confirmObservation}</ItemTitle>
        </div>
      )}

      {/* Payment Date */}
      {data.paymentDate && (
        <div>
          <ItemDescription>{t('date.of.payment')}</ItemDescription>
          <ItemTitle>{formatDate(data.paymentDate, 'dd MMM yyyy, HH:mm')}</ItemTitle>
        </div>
      )}

      {/* Buy Request */}
      {data.buyRequest && (
        <div className="md:col-span-2 lg:col-span-4">
          <ItemDescription>{t('buy.request')}</ItemDescription>
          <ItemTitle>{data.buyRequest}</ItemTitle>
        </div>
      )}
    </div>
  );
}
