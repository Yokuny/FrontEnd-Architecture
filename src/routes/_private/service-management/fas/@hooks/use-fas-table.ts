import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';
import { useFasPaginated } from '@/hooks/use-fas-api';
import type { FasSearch } from '../@interface/fas.schema';

export function useFasTable() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_private/service-management/fas/' });
  const { idEnterprise } = useEnterpriseFilter();

  const handleFiltersChange = useCallback(
    (newFilters: Partial<FasSearch>) => {
      navigate({
        search: ((prev: any) => ({
          ...prev,
          ...newFilters,
          page: 1, // Reset to page 1 on filter change
        })) as any,
      });
    },
    [navigate],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      navigate({
        search: ((prev: any) => ({
          ...prev,
          page,
        })) as any,
      });
    },
    [navigate],
  );

  const handleClearFilters = useCallback(() => {
    navigate({
      search: ((prev: any) => ({
        page: 1,
        size: prev.size,
      })) as any,
    });
  }, [navigate]);

  const query = useFasPaginated({
    ...search,
    idEnterprise: idEnterprise || '',
  });

  return {
    filters: search,
    onFilterChange: handleFiltersChange,
    onPageChange: handlePageChange,
    onClearFilters: handleClearFilters,
    data: query.data?.data,
    totalItems: query.data?.pageInfo?.[0]?.count || 0,
    isLoading: query.isLoading,
  };
}
