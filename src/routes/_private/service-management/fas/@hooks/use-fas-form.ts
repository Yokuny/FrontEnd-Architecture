import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useFasExistsValidation, useOpenFas } from '@/hooks/use-fas-api';
import { type FasFormValues, fasFormSchema } from '../@interface/fas-form.schema';
import { preUploadAttachments } from '../@utils/fas.utils';

export function useFasForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idEnterprise: contextEnterpriseId } = useEnterpriseFilter();
  const openFasMutation = useOpenFas();

  const form = useForm<FasFormValues>({
    resolver: zodResolver(fasFormSchema),
    defaultValues: {
      idEnterprise: contextEnterpriseId || '',
      idVessel: '',
      type: '',
      serviceDate: '',
      teamChange: false,
      local: '',
      orders: [],
    },
  });

  const watchedValues = form.watch(['idVessel', 'serviceDate', 'type']);
  const existsQuery = useFasExistsValidation({
    idVessel: watchedValues[0],
    dateOnly: watchedValues[1] ? watchedValues[1].split('T')[0] : '',
    type: watchedValues[2],
    timezone: format(new Date(), 'xxx'), // Format like -03:00
  });

  const onSubmit = async (values: FasFormValues) => {
    // 1. Double Check Existence
    const { data: currentExistsData } = await existsQuery.refetch();
    if (currentExistsData?.fasExists) {
      if (!confirm(t('fas.already.exists.proceed'))) {
        return;
      }
    }

    try {
      // 2. Pre-upload Attachments
      const ordersWithUploads = await Promise.all(
        values.orders.map(async (order) => {
          let uploadedFiles = order.files || [];
          // If files contain raw File objects (not yet uploaded structure), upload them
          // Note: Logic assumes if it has File objects, it needs upload.
          // Legacy check: if (order.files && !orderId) -> implies new files.
          // We check if the first item is a File instance or similar indicator.
          const hasPendingFiles = order.files?.some((f: any) => f instanceof File);

          if (hasPendingFiles) {
            uploadedFiles = await preUploadAttachments({
              files: order.files || [],
              supplierCanView: order.supplierCanView,
            });
          }

          return {
            ...order,
            files: uploadedFiles,
          };
        }),
      );

      // 3. Sanitize and Finalize
      const ordersFinal = ordersWithUploads.map((order) => {
        // Sanitize Name: remove trailing '/'
        const sanitizedName = order.name?.slice(-1) === '/' ? order.name.slice(0, -1) : order.name;

        return {
          ...order,
          name: sanitizedName,
          files: order.files || [],
          supplierCanView: order.supplierCanView ?? true,
          partial: order.partial || 'complete.execution',
          materialFasCode: order.materialFasCode || 'N/A',
          rmrbCode: order.rmrbCode || 'N/A',
        };
      });

      await openFasMutation.mutateAsync({
        ...values,
        orders: ordersFinal,
      });
      navigate({ to: '/service-management/fas' });
    } catch (_error) {
      // Error handled by mutation
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: openFasMutation.isPending,
    existsData: existsQuery.data,
  };
}
