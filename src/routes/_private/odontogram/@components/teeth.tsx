import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Tooth from './tooth';

export default function Teeth({ form, odontogram }: { form?: any; odontogram?: any[] }) {
  if (!form.value) form.value = [];

  const cleanToothFace = () => form.onChange([]);
  const permanentTeethNumbers = {
    top: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    bottom: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
  };
  const deciduousTeethNumbers = {
    top: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    bottom: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
  };

  const getToothStatus = (toothNumber: number) => {
    const tooth = odontogram?.find((t: any) => t.number === toothNumber);
    return tooth?.status || 'normal';
  };

  const handleToothFace = (toothNumber: number, face: any) => {
    const toothFace = () => {
      const prev = form.value || [];
      const index = prev.findIndex((tooth: any) => tooth.number === toothNumber);
      if (index === -1) {
        prev.push({ number: toothNumber, faces: face });
        return prev;
      }

      if (!prev[index]) {
        prev[index] = { number: toothNumber, faces: {} };
      }

      if (!prev[index].faces) {
        prev[index].faces = {};
      }

      for (const key in face) {
        if (face[key]) {
          prev[index].faces[key] = face[key];
        }
      }

      return prev;
    };
    form.onChange(toothFace());
  };

  return (
    <div className="flex flex-col gap-2">
      <Tabs defaultValue="permanentes" className="flex w-full flex-col gap-4">
        {['permanentes', 'deciduos'].map((teeth) => (
          <TabsContent key={teeth} value={teeth} className="flex flex-col items-center gap-2 rounded-lg border bg-background p-4 md:p-8">
            <div className="flex min-w-max justify-center">
              {teeth === 'permanentes'
                ? permanentTeethNumbers.top.map((toothNumber) => (
                    <Tooth handleFace={handleToothFace} number={toothNumber} bottom={false} key={toothNumber} status={getToothStatus(toothNumber)} />
                  ))
                : deciduousTeethNumbers.top.map((toothNumber) => (
                    <Tooth handleFace={handleToothFace} number={toothNumber} bottom={false} key={toothNumber} status={getToothStatus(toothNumber)} />
                  ))}
            </div>
            <div className="flex min-w-max justify-center p-1">
              {teeth === 'permanentes'
                ? permanentTeethNumbers.bottom.map((toothNumber) => (
                    <Tooth handleFace={handleToothFace} number={toothNumber} bottom={true} key={toothNumber} status={getToothStatus(toothNumber)} />
                  ))
                : deciduousTeethNumbers.bottom.map((toothNumber) => (
                    <Tooth handleFace={handleToothFace} number={toothNumber} bottom={true} key={toothNumber} status={getToothStatus(toothNumber)} />
                  ))}
            </div>
          </TabsContent>
        ))}
        <div className="flex w-full justify-center">
          <TabsList className="grid h-auto w-fit grid-cols-2 rounded-lg border">
            <TabsTrigger value="permanentes" onClick={cleanToothFace}>
              Permanentes
            </TabsTrigger>
            <TabsTrigger value="deciduos" onClick={cleanToothFace}>
              Decíduos
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
