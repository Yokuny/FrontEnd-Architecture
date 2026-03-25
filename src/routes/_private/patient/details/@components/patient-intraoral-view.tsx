import { useNavigate } from '@tanstack/react-router';
import Edit from '@/components/icons/Edit.Icon';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemDescription, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/helpers/formatDate.utils';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import type { Intraoral } from '@/lib/interfaces';

export const PatientIntraoralView = ({ intraoral, patientId }: { intraoral?: Intraoral; patientId: string }) => {
  const navigate = useNavigate();

  if (!intraoral || intraoral.updatedAt === intraoral.createdAt) {
    return (
      <Item variant="outline" className="flex flex-col items-center justify-center p-12 text-center">
        <ItemTitle className="mb-4 text-xl">Registro Intraoral</ItemTitle>
        <ItemDescription className="mb-4">Nenhum exame intraoral cadastrado para este paciente.</ItemDescription>
        <Button onClick={() => navigate({ to: '/patient/details/intraoral', search: { id: patientId } })} variant="outline">
          Cadastrar Exame Intraoral
        </Button>
      </Item>
    );
  }

  const healthData = [
    ...(intraoral.hygiene ? [{ aspect: 'Higiene', condition: intraoral.hygiene }] : []),
    ...(intraoral.halitosis ? [{ aspect: 'Mau hálito', condition: intraoral.halitosis }] : []),
    ...(intraoral.tartar ? [{ aspect: 'Tártaro', condition: intraoral.tartar }] : []),
    ...(intraoral.gums ? [{ aspect: 'Gengivas', condition: intraoral.gums }] : []),
    ...(intraoral.mucosa ? [{ aspect: 'Mucosa', condition: intraoral.mucosa }] : []),
  ];

  const regionData = [
    ...(intraoral.tongue ? [{ region: 'Língua', description: intraoral.tongue }] : []),
    ...(intraoral.palate ? [{ region: 'Palato (Céu da boca)', description: intraoral.palate }] : []),
    ...(intraoral.oralFloor ? [{ region: 'Assoalho bucal', description: intraoral.oralFloor }] : []),
    ...(intraoral.lips ? [{ region: 'Lábios', description: intraoral.lips }] : []),
    ...(intraoral.otherObservations ? [{ region: 'Outras Observações', description: intraoral.otherObservations }] : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <ItemHeader className="flex flex-row items-center justify-between">
        <ItemTitle className="text-xl">Registro Intraoral</ItemTitle>
        <ItemActions>
          <Button variant="outline" onClick={() => navigate({ to: '/patient/details/intraoral', search: { id: patientId } })}>
            <Edit className="mr-2 size-4" /> Editar
          </Button>
        </ItemActions>
      </ItemHeader>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Item variant="outline" className="flex-col items-start gap-4 p-6">
          <ItemTitle className="font-semibold text-lg tracking-tight">Avaliação da Saúde Bucal</ItemTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aspecto</TableHead>
                <TableHead>Condição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthData.map((item) => (
                <TableRow key={item.aspect}>
                  <TableCell className="font-medium">{item.aspect}</TableCell>
                  <TableCell>{capitalizeString(item.condition)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Item>

        <Item variant="outline" className="flex-col items-start gap-4 p-6">
          <ItemTitle className="font-semibold text-lg tracking-tight">Regiões Específicas</ItemTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Região</TableHead>
                <TableHead>Descrição/Achados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regionData.map((item) => (
                <TableRow key={item.region}>
                  <TableCell className="font-medium">{item.region}</TableCell>
                  <TableCell>{capitalizeString(item.description)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Item>
      </div>

      <div className="flex w-full items-center justify-end gap-2">
        <ItemDescription>Última atualização:</ItemDescription>
        <ItemTitle>{formatDate(intraoral.updatedAt)}</ItemTitle>
      </div>
    </div>
  );
};
