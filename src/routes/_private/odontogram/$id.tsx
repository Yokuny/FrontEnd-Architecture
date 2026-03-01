import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Stethoscope, User } from 'lucide-react';
import DefaultLoading from '@/components/default-loading';
import ToothNumber from '@/components/odontogram/tooth-number';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import { useOdontogramDetailQuery } from '@/query/odontogram';
import { getPatientImage, getPatientName, usePatientsQuery } from '@/query/patients';
import { getProfessionalImage, getProfessionalName, useProfessionalsQuery } from '@/query/professionals';
import { OdontogramStatusForm } from './@components/odontogram-status-form';

export const Route = createFileRoute('/_private/odontogram/$id')({
  component: OdontogramDetailPage,
});

function getFacesWithProcedures(faces: any) {
  const facesWithProcedures: { face: string; procedure: string }[] = [];
  if (!faces) return facesWithProcedures;

  for (const [face, value] of Object.entries(faces)) {
    if (value) {
      facesWithProcedures.push({
        face: capitalizeString(face),
        procedure: value as string,
      });
    }
  }
  return facesWithProcedures;
}

function OdontogramDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data: odontogram, isLoading, error } = useOdontogramDetailQuery(id);
  const { data: professionals } = useProfessionalsQuery();
  const { data: patients } = usePatientsQuery();

  if (isLoading) return <DefaultLoading />;
  if (error || !odontogram) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <p className="mb-4 text-destructive">Odontograma não encontrado ou erro ao carregar.</p>
          <Button onClick={() => navigate({ to: '..' })}>Voltar</Button>
        </CardContent>
      </Card>
    );
  }

  const patientName = getPatientName(patients, odontogram.Patient);
  const patientImage = getPatientImage(patients, odontogram.Patient);
  const professionalName = getProfessionalName(professionals, odontogram.Professional);
  const professionalImage = getProfessionalImage(professionals, odontogram.Professional);

  return (
    <Card>
      <CardHeader>
        <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
          <div>
            <CardTitle>Odontograma • {patientName}</CardTitle>
            <CardDescription>Visualize o histórico e atualize o status dos procedimentos</CardDescription>
          </div>
          <CardAction>
            {/* @ts-expect-error Types not matched fully */}
            <Button variant="outline" onClick={() => navigate({ to: '/odontogram' })}>
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Button>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Info */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
            <Avatar className="size-12">
              <AvatarImage src={patientImage} />
              <AvatarFallback>
                <User className="size-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-muted-foreground text-sm">Paciente</p>
              <h3 className="font-semibold text-lg">{patientName}</h3>
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                // @ts-expect-error Route may be ungenerated
                navigate({ to: '/patient/$id', params: { id: odontogram.Patient } });
              }}
            >
              Perfil
            </Button>
          </div>

          <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
            <Avatar className="size-12">
              <AvatarImage src={professionalImage} />
              <AvatarFallback>
                <Stethoscope className="size-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-muted-foreground text-sm">Profissional</p>
              <h3 className="font-semibold text-lg">{professionalName}</h3>
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                // @ts-expect-error Route may be ungenerated
                navigate({ to: '/professional/$id', params: { id: odontogram.Professional } });
              }}
            >
              Perfil
            </Button>
          </div>
        </div>

        {/* Teeth List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-xl">Procedimentos por Dente</h2>
          {odontogram.teeth && odontogram.teeth.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {odontogram.teeth.map((tooth) => {
                const facesWithProcedures = getFacesWithProcedures(tooth.faces);
                if (facesWithProcedures.length === 0) return null;

                return (
                  <div key={tooth.number} className="flex items-start gap-6 rounded-lg border p-4 shadow-sm">
                    <div className="w-10">
                      <ToothNumber toothNumber={tooth.number} />
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-lg">Dente {tooth.number}</h4>
                      <ul className="space-y-1">
                        {facesWithProcedures.map((item, idx) => (
                          <li key={idx} className="text-sm">
                            <span className="font-medium">{item.face}:</span> <span className="text-muted-foreground">{item.procedure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum procedimento registrado.</p>
          )}
        </div>

        {/* Formulation / Edicao */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="edit" className="border-b-0">
            <AccordionTrigger className="rounded-lg border px-4 hover:no-underline">
              <h2 className="font-semibold text-lg">Configuração (Edição)</h2>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <OdontogramStatusForm id={odontogram._id} initialStatus={odontogram.finished || false} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
