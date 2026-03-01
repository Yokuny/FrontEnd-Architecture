import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import type { Intraoral } from '@/lib/interfaces';

export const PatientIntraoralView = ({ intraoral }: { intraoral?: Intraoral }) => {
  if (!intraoral || intraoral.updatedAt === intraoral.createdAt) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <CardTitle className="mb-4 text-xl">Registro Intraoral</CardTitle>
          <p className="mb-4 text-muted-foreground">Nenhum exame intraoral cadastrado para este paciente.</p>
          <Button onClick={() => alert('Em breve: Formulário Intraoral')} variant="outline">
            Cadastrar Exame Intraoral
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Registro Intraoral</CardTitle>
        <Button variant="outline" onClick={() => alert('Em breve: Formulário Intraoral')}>
          <Edit className="mr-2 size-4" /> Editar
        </Button>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-md border p-6">
          <h3 className="font-semibold text-lg tracking-tight">Avaliação da Saúde Bucal</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="w-1/3 font-semibold">Aspecto</TableCell>
                <TableCell className="w-2/3 font-semibold">Condição</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intraoral.hygiene && (
                <TableRow>
                  <TableCell className="font-medium">Higiene</TableCell>
                  <TableCell>{capitalizeString(intraoral.hygiene)}</TableCell>
                </TableRow>
              )}
              {intraoral.halitosis && (
                <TableRow>
                  <TableCell className="font-medium">Mau hálito</TableCell>
                  <TableCell>{capitalizeString(intraoral.halitosis)}</TableCell>
                </TableRow>
              )}
              {intraoral.tartar && (
                <TableRow>
                  <TableCell className="font-medium">Tártaro</TableCell>
                  <TableCell>{capitalizeString(intraoral.tartar)}</TableCell>
                </TableRow>
              )}
              {intraoral.gums && (
                <TableRow>
                  <TableCell className="font-medium">Gengivas</TableCell>
                  <TableCell>{capitalizeString(intraoral.gums)}</TableCell>
                </TableRow>
              )}
              {intraoral.mucosa && (
                <TableRow>
                  <TableCell className="font-medium">Mucosa</TableCell>
                  <TableCell>{capitalizeString(intraoral.mucosa)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4 rounded-md border p-6">
          <h3 className="font-semibold text-lg tracking-tight">Regiões Específicas</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="w-1/3 font-semibold">Região</TableCell>
                <TableCell className="w-2/3 font-semibold">Descrição/Achados</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intraoral.tongue && (
                <TableRow>
                  <TableCell className="font-medium">Língua</TableCell>
                  <TableCell>{capitalizeString(intraoral.tongue)}</TableCell>
                </TableRow>
              )}
              {intraoral.palate && (
                <TableRow>
                  <TableCell className="font-medium">Palato (Céu da boca)</TableCell>
                  <TableCell>{capitalizeString(intraoral.palate)}</TableCell>
                </TableRow>
              )}
              {intraoral.oralFloor && (
                <TableRow>
                  <TableCell className="font-medium">Assoalho bucal</TableCell>
                  <TableCell>{capitalizeString(intraoral.oralFloor)}</TableCell>
                </TableRow>
              )}
              {intraoral.lips && (
                <TableRow>
                  <TableCell className="font-medium">Lábios</TableCell>
                  <TableCell>{capitalizeString(intraoral.lips)}</TableCell>
                </TableRow>
              )}
              {intraoral.otherObservations && (
                <TableRow>
                  <TableCell className="font-medium">Outras Observações</TableCell>
                  <TableCell>{capitalizeString(intraoral.otherObservations)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
