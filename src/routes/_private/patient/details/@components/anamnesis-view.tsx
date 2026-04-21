import { useNavigate } from '@tanstack/react-router';
import DefaultEmptyData from '@/components/default-empty-data';

import DefaultFormLayout, { type FormSection } from '@/components/default-form-layout';
import Edit from '@/components/icons/Edit.Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/helpers/formatDate.helper';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import { t } from '@/lib/helpers/translate.helper';
import type { Anamnesis } from '@/lib/interfaces';
import { cn } from '@/lib/utils/cn.util';

export const ANAMNESIS_SEVERITY_MAP = {
  allergicToMedication: 'high',
  infectiousDisease: 'high',
  importantHealthInformation: 'high',
  diabetes: 'high',
  heartProblems: 'high',
  highBloodPressure: 'high',
  tuberculosis: 'high',
  arthritis: 'medium',
  asthma: 'medium',
  kidneyProblems: 'medium',
  liverProblems: 'medium',
  otherIllnesses: 'medium',
  pregnant: 'medium',
  breastfeeding: 'medium',
  underMedicalTreatment: 'medium',
  takingMedication: 'medium',
} as const;

const AnamnesisContent = ({ anamnesis }: { anamnesis: Anamnesis }) => {
  const getSeverityDot = (condition: boolean, severity: 'high' | 'medium' = 'medium') => {
    if (!condition) return null;
    return <div className={cn('ml-2 size-2 rounded-full', severity === 'high' ? 'bg-red-500' : 'bg-yellow-500')} />;
  };

  const attentionCount = Object.entries(ANAMNESIS_SEVERITY_MAP).filter(([key, severity]) => {
    if (severity !== 'high' && severity !== 'medium') return false;
    const value = (anamnesis as Record<string, unknown>)[key] || (anamnesis.illnesses as Record<string, unknown>)?.[key];
    if (key === 'otherIllnesses' || key === 'importantHealthInformation' || key === 'infectiousDisease') {
      return value && !['', 'nenhuma', 'não', 'não tem', 'não informado'].includes(String(value).toLowerCase());
    }
    return String(value) === 'true';
  }).length;

  const hasIllnesses =
    anamnesis.illnesses?.diabetes ||
    anamnesis.illnesses?.tuberculosis ||
    anamnesis.illnesses?.heartProblems ||
    anamnesis.illnesses?.highBloodPressure ||
    anamnesis.illnesses?.arthritis ||
    anamnesis.illnesses?.asthma ||
    anamnesis.illnesses?.kidneyProblems ||
    anamnesis.illnesses?.liverProblems ||
    anamnesis.illnesses?.otherIllnesses;

  const hasMedication = anamnesis.allergicToMedication || anamnesis.takingMedication || anamnesis.underMedicalTreatment;

  const hasSpecialConditions = anamnesis.pregnant || anamnesis.breastfeeding || anamnesis.gumsBleedEasily || anamnesis.sensitiveTeeth;

  const hasHabits = anamnesis.smoker || anamnesis.alcoholConsumer || anamnesis.bitesPenOrPencil || anamnesis.nailsBiting || anamnesis.otherHarmfulHabits;

  const hasCriticalInfo = anamnesis.importantHealthInformation || anamnesis.infectiousDisease;

  const sections: FormSection[] = [];

  if (anamnesis.mainComplaint) {
    sections.push({
      title: t('main.complaint.title'),
      fields: [<span key="main-complaint">{capitalizeString(anamnesis.mainComplaint)}</span>],
    });
  }

  if (hasIllnesses) {
    sections.push({
      title: t('medical.conditions'),
      fields: [
        <Table key="illnesses-table" className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-5/12 font-semibold text-xs">{t('condition')}</TableHead>
              <TableHead className="w-1/12 font-semibold text-xs">{t('status')}</TableHead>
              <TableHead className="w-5/12 font-semibold text-xs">{t('details')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anamnesis.illnesses?.diabetes && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('illness.diabetes')}
                    {getSeverityDot(true, 'high')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="red">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.tuberculosis && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('illness.tuberculosis')}
                    {getSeverityDot(true, 'high')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="red">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.heartProblems && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('illness.heart')}
                    {getSeverityDot(true, 'high')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="red">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.highBloodPressure && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('illness.hypertension')}
                    {getSeverityDot(true, 'high')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="red">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.arthritis && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('illness.arthritis')}
                    {getSeverityDot(true, 'medium')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.asthma && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('illness.asthma')}
                    {getSeverityDot(true, 'medium')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.kidneyProblems && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('illness.kidney')}
                    {getSeverityDot(true, 'medium')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.liverProblems && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('illness.liver')}
                    {getSeverityDot(true, 'medium')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.illnesses?.otherIllnesses && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('illness.other')}
                    {getSeverityDot(true, 'medium')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">{capitalizeString(anamnesis.illnesses.otherIllnesses)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>,
      ],
    });
  }

  if (hasMedication) {
    sections.push({
      title: t('medications.allergies'),
      fields: [
        <Table key="medication-table" className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-5/12 font-semibold text-xs">{t('aspect')}</TableHead>
              <TableHead className="w-1/12 font-semibold text-xs">{t('status')}</TableHead>
              <TableHead className="w-5/12 font-semibold text-xs">{t('details')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anamnesis.allergicToMedication && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('allergic.medications')}
                    {getSeverityDot(true, 'high')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="red">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">{anamnesis.medicationAllergy ? capitalizeString(anamnesis.medicationAllergy) : '-'}</TableCell>
              </TableRow>
            )}
            {anamnesis.takingMedication && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('taking.medications')}
                    {getSeverityDot(true, 'medium')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">{anamnesis.medicationDetails ? capitalizeString(anamnesis.medicationDetails) : '-'}</TableCell>
              </TableRow>
            )}
            {anamnesis.underMedicalTreatment && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('under.medical.treatment')}
                    {getSeverityDot(true, 'medium')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">{anamnesis.medicalTreatmentDetails ? capitalizeString(anamnesis.medicalTreatmentDetails) : '-'}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>,
      ],
    });
  }

  if (hasSpecialConditions) {
    sections.push({
      title: t('special.conditions'),
      fields: [
        <Table key="special-conditions-table" className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-5/12 font-semibold text-xs">{t('condition')}</TableHead>
              <TableHead className="w-1/12 font-semibold text-xs">{t('status')}</TableHead>
              <TableHead className="w-5/12 font-semibold text-xs">{t('details')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anamnesis.pregnant && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('pregnant')}
                    {getSeverityDot(true, 'medium')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">{anamnesis.pregnancyMonth ? `${anamnesis.pregnancyMonth}${t('pregnancy.month.suffix')}` : '-'}</TableCell>
              </TableRow>
            )}
            {anamnesis.breastfeeding && (
              <TableRow>
                <TableCell className="text-sm">
                  <span className="flex items-center gap-1">
                    {t('breastfeeding')}
                    {getSeverityDot(true, 'medium')}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.gumsBleedEasily && (
              <TableRow>
                <TableCell className="text-sm">{t('gums.bleed.easily')}</TableCell>
                <TableCell>
                  <Badge variant="muted">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.sensitiveTeeth && (
              <TableRow>
                <TableCell className="text-sm">{t('sensitive.teeth')}</TableCell>
                <TableCell>
                  <Badge variant="muted">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>,
      ],
    });
  }

  if (hasHabits) {
    sections.push({
      title: t('habits'),
      fields: [
        <Table key="habits-table" className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-5/12 font-semibold text-xs">{t('habit')}</TableHead>
              <TableHead className="w-1/12 font-semibold text-xs">{t('status')}</TableHead>
              <TableHead className="w-5/12 font-semibold text-xs">{t('details')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anamnesis.smoker && (
              <TableRow>
                <TableCell className="text-sm">{t('smoker')}</TableCell>
                <TableCell>
                  <Badge variant="red">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.alcoholConsumer && (
              <TableRow>
                <TableCell className="text-sm">{t('alcohol.consumer')}</TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.bitesPenOrPencil && (
              <TableRow>
                <TableCell className="text-sm">{t('bites.pen.pencil')}</TableCell>
                <TableCell>
                  <Badge variant="muted">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.nailsBiting && (
              <TableRow>
                <TableCell className="text-sm">{t('nails.biting')}</TableCell>
                <TableCell>
                  <Badge variant="muted">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">-</TableCell>
              </TableRow>
            )}
            {anamnesis.otherHarmfulHabits && (
              <TableRow>
                <TableCell className="text-sm">{t('other.harmful.habits')}</TableCell>
                <TableCell>
                  <Badge variant="amber">{t('yes')}</Badge>
                </TableCell>
                <TableCell className="text-sm">{capitalizeString(anamnesis.otherHarmfulHabits)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>,
      ],
    });
  }

  if (hasCriticalInfo) {
    sections.push({
      title: t('critical.information'),
      fields: [
        <div key="critical-info" className="space-y-2">
          {anamnesis.importantHealthInformation && (
            <div className="flex items-center justify-between gap-3 rounded-md bg-destructive/5 p-3 px-6">
              <div>
                <div className="flex items-center gap-1">
                  {getSeverityDot(true, 'high')}
                  <span className="text-muted-foreground text-sm">{t('important.health.info.label')}</span>
                </div>
                <span className="font-semibold">{capitalizeString(anamnesis.importantHealthInformation)}</span>
              </div>
              <Badge variant="red">{t('attention')}</Badge>
            </div>
          )}
          {anamnesis.infectiousDisease && (
            <div className="flex items-center justify-between gap-3 rounded-md bg-destructive/5 p-3 px-6">
              <div>
                <div className="flex items-center gap-1">
                  {getSeverityDot(true, 'high')}
                  <span className="text-muted-foreground text-sm">{t('infectious.disease.label')}</span>
                </div>
                <span className="font-semibold">{capitalizeString(anamnesis.infectiousDisease)}</span>
              </div>
              <Badge variant="red">{t('attention')}</Badge>
            </div>
          )}
        </div>,
      ],
    });
  }

  return (
    <>
      {attentionCount > 0 && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/5 px-4 py-3 text-destructive">
          <Badge variant="red">{attentionCount}</Badge>
          <span className="font-semibold">{t('attention.points.message')}</span>
        </div>
      )}

      <DefaultFormLayout sections={sections} />
    </>
  );
};

export const PatientAnamnesisView = ({ anamnesis, patientId }: { anamnesis?: Anamnesis; patientId: string }) => {
  const navigate = useNavigate();
  const hasData = !!anamnesis && anamnesis.updatedAt !== anamnesis.createdAt;

  return (
    <Item>
      <ItemHeader>
        <ItemTitle className="text-xl">{t('anamnesis.record')}</ItemTitle>
        <ItemActions>
          <Button onClick={() => navigate({ to: '/patient/details/anamnesis', search: { id: patientId } })}>
            {hasData ? (
              <>
                <Edit className="mr-2 size-4" /> {t('edit')}
              </>
            ) : (
              t('register')
            )}
          </Button>
        </ItemActions>
      </ItemHeader>

      <ItemContent>{hasData ? <AnamnesisContent anamnesis={anamnesis} /> : <DefaultEmptyData />}</ItemContent>

      {hasData && (
        <ItemFooter>
          <div className="flex w-full items-center justify-end gap-2">
            <ItemDescription>{t('last.updated')}</ItemDescription>
            <ItemTitle>{formatDate(anamnesis.updatedAt)}</ItemTitle>
          </div>
        </ItemFooter>
      )}
    </Item>
  );
};
