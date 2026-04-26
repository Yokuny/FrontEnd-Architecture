import { useEffect, useState } from 'react';
import { BadgeIndicator } from '@/components/ui/badge';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { UnstyledButton } from '@/components/ui/unstyled-button';
import { currencyFormat } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { ProcedureData } from '@/lib/interfaces';

const EditableCell = ({
  value,
  rowIndex,
  columnId,
  updateData,
}: {
  value: any;
  rowIndex: number;
  columnId: string;
  updateData: (rowIndex: number, columnId: string, value: any) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [cellValue, setCellValue] = useState(value ?? '');

  const onBlur = () => {
    setEditing(false);
    if (cellValue !== String(value ?? '')) {
      updateData(rowIndex, columnId, cellValue);
    }
  };

  useEffect(() => {
    setCellValue(value ?? '');
  }, [value]);

  if (editing) {
    return <Input value={cellValue ?? ''} onChange={(e) => setCellValue(e.target.value)} onBlur={onBlur} autoFocus className="h-8 w-full min-w-[100px] text-xs" />;
  }

  return (
    <UnstyledButton className="w-full py-1 text-left font-normal" onClick={() => setEditing(true)}>
      {columnId === 'procedure' || columnId === 'group' ? (
        cellValue
      ) : columnId === 'periodicity' ? (
        <span className="text-muted-foreground">{cellValue ? `${cellValue} ${t('days')}` : '-'}</span>
      ) : (
        <span className="flex w-fit items-center gap-2 underline decoration-dashed underline-offset-4">
          <BadgeIndicator variant={columnId === 'costPrice' ? 'pending' : columnId === 'suggestedPrice' ? 'waiting' : 'paid'} pulse />
          {currencyFormat(cellValue)}
        </span>
      )}
    </UnstyledButton>
  );
};

interface ProcedureTableProps {
  data: ProcedureData[];
  onUpdate: (updatedData: ProcedureData[]) => void;
}

export function SettingsProceduresTable({ data, onUpdate }: ProcedureTableProps) {
  const [tableData, setTableData] = useState<ProcedureData[]>(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const updateData = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...tableData];
    const oldData = newData[rowIndex];
    if (!oldData) return;

    let processedValue = value;

    if (columnId.includes('Price') || columnId === 'periodicity') {
      if (value === '' || value === null || value === undefined) {
        processedValue = columnId === 'periodicity' ? undefined : 0;
      } else {
        const numValue = parseFloat(value);
        processedValue = Number.isNaN(numValue) ? (columnId === 'periodicity' ? undefined : 0) : numValue;
      }
    }

    const updatedData: ProcedureData = {
      ...oldData,
      [columnId]: processedValue,
    };

    newData[rowIndex] = updatedData;
    setTableData(newData);
    onUpdate(newData);
  };

  const columns: DataTableColumn<ProcedureData>[] = [
    {
      key: 'procedure',
      header: t('procedure.singular'),
      sortable: true,
      render: (val, _, i) => <EditableCell value={val} rowIndex={i as number} columnId="procedure" updateData={updateData} />,
    },
    {
      key: 'group',
      header: t('procedure.group'),
      sortable: true,
      render: (val, _, i) => <EditableCell value={val} rowIndex={i as number} columnId="group" updateData={updateData} />,
    },
    {
      key: 'costPrice',
      header: t('cost'),
      sortable: true,
      render: (val, _, i) => <EditableCell value={val} rowIndex={i as number} columnId="costPrice" updateData={updateData} />,
    },
    {
      key: 'suggestedPrice',
      header: t('suggested'),
      sortable: true,
      render: (val, _, i) => <EditableCell value={val} rowIndex={i as number} columnId="suggestedPrice" updateData={updateData} />,
    },
    {
      key: 'savedPrice',
      header: t('saved'),
      sortable: true,
      render: (val, _, i) => <EditableCell value={val} rowIndex={i as number} columnId="savedPrice" updateData={updateData} />,
    },
    {
      key: 'periodicity',
      header: t('periodicity'),
      sortable: true,
      render: (val, _, i) => <EditableCell value={val} rowIndex={i as number} columnId="periodicity" updateData={updateData} />,
    },
  ];

  return (
    <div className="mt-4 w-full">
      <DataTable data={tableData} columns={columns} searchable itemsPerPage={20} bordered columnSelector />
    </div>
  );
}
