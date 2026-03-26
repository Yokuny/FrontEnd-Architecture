import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import { usePatientsQuery } from '@/query/patients';
import type { SearchParams } from '../@interface/patient.interface';

export function usePatientList() {
  const navigate = useNavigate();
  const { page, size, search } = useSearch({ from: '/_private/patient/' } as any) as SearchParams;
  const { data = [], isLoading } = usePatientsQuery();

  const handlePageChange = useCallback((newPage: number) => navigate({ search: (prev: any) => ({ ...prev, page: newPage }), replace: true } as any), [navigate]);

  const handlePageSizeChange = useCallback((newSize: number) => navigate({ search: (prev: any) => ({ ...prev, size: newSize, page: 1 }), replace: true } as any), [navigate]);

  return {
    page,
    size,
    search,
    data,
    isLoading,
    handlePageChange,
    handlePageSizeChange,
    navigate,
  };
}
