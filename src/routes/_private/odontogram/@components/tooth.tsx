import { useState } from 'react';
import { toast } from 'sonner';

import ProceduresSheet from '@/components/data-inputs/procedures-sheet';
import { ToothParts } from '@/components/odontogram/assets/odontogram';
import ToothNumber from '@/components/odontogram/tooth-number';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const LEFT = [11, 12, 13, 14, 15, 16, 17, 18, 41, 42, 43, 44, 45, 46, 47, 48, 51, 52, 53, 54, 55, 81, 82, 83, 84, 85];
const INCISAL = [11, 12, 21, 22, 31, 32, 41, 42, 51, 52, 61, 62, 71, 72, 81, 82];

const ToothPopover = ({ number, face }: { number: number; face: string }) => {
  return (
    <div className="flex items-center space-x-6 text-xs">
      <div className="flex flex-col">
        <p className="text-muted-foreground">Dente</p>
        <h3 className="font-medium text-base leading-none">{number}</h3>
      </div>
      <div className="flex flex-col">
        <p className="text-muted-foreground">Face</p>
        <h3 className="font-medium text-base leading-none">{face}</h3>
      </div>
    </div>
  );
};

export default function Tooth({ handleFace, number, bottom, status }: any) {
  const [faces, setFaces] = useState({
    center: false,
    top: false,
    right: false,
    bottom: false,
    left: false,
  });

  const [procedure, setProcedure] = useState<any>(null);
  const [midPopover, setMidPopover] = useState<boolean>(false);
  const [topPopover, setTopPopover] = useState<boolean>(false);
  const [bottomPopover, setBottomPopover] = useState<boolean>(false);
  const [rightPopover, setRightPopover] = useState<boolean>(false);
  const [leftPopover, setLeftPopover] = useState<boolean>(false);

  const handleProcedure = (procedure: any) => {
    setProcedure({
      procedure: procedure.procedure,
      price: Number(procedure.price),
      status: procedure.status,
      periodicity: procedure.periodicity,
    });
  };

  const getToothFace = (face: string, procedure: any) => {
    const baseObj = {
      facial: undefined,
      lingual: undefined,
      palatal: undefined,
      mesial: undefined,
      distal: undefined,
      occlusal: undefined,
      incisal: undefined,
    };
    switch (face) {
      case 'Facial':
        return { ...baseObj, facial: procedure };
      case 'Lingual':
        return { ...baseObj, lingual: procedure };
      case 'Palatal':
        return { ...baseObj, palatal: procedure };
      case 'Mesial':
        return { ...baseObj, mesial: procedure };
      case 'Distal':
        return { ...baseObj, distal: procedure };
      case 'Oclusal':
        return { ...baseObj, occlusal: procedure };
      case 'Incisal':
        return { ...baseObj, incisal: procedure };
      default:
        return baseObj;
    }
  };

  const noProcessToast = () => {
    toast.error('Não foi possível adicionar o procedimento');
  };

  return (
    <div className={`flex h-auto items-center justify-end gap-2 ${bottom ? 'flex-col-reverse' : 'flex-col'}`}>
      <ToothNumber toothNumber={number} status={status} />
      <div className="text-stone-500/70 dark:text-zinc-300/80">
        <div className="relative p-1">
          <ToothParts select={faces} className="p-px text-stone-500/80 dark:text-zinc-300/80" />
          <div className="absolute top-0 left-0 size-10 cursor-pointer">
            <Popover open={midPopover} onOpenChange={setMidPopover}>
              <PopoverTrigger asChild className="w-full">
                <Button className="absolute top-1/3 left-1/3 h-1/3 w-1/3 rounded-none border-sky-blue/30 p-0 hover:border hover:bg-sky-blue/10" variant="ghost" type="button" />
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="flex flex-col space-y-3">
                  <ToothPopover number={number} face={INCISAL.includes(number) ? 'Incisal' : 'Oclusal'} />
                  <div className="flex h-full flex-col items-center space-y-1 md:space-y-2">
                    <p>{procedure?.procedure}</p>
                    <ProceduresSheet handleProcedure={handleProcedure} />
                  </div>
                  {procedure && (
                    <div className="flex w-full gap-2 pt-4">
                      <Button
                        size="sm"
                        className="w-1/3"
                        variant="ghost"
                        onClick={() => {
                          setProcedure(null);
                          setMidPopover(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="w-2/3"
                        onClick={() => {
                          const tooth = getToothFace(INCISAL.includes(number) ? 'Incisal' : 'Oclusal', procedure);
                          if (!tooth.occlusal && !tooth.incisal) return noProcessToast();
                          handleFace?.(number, tooth);
                          setFaces((prev) => ({ ...prev, center: true }));
                          setMidPopover(false);
                          setProcedure(null);
                        }}
                      >
                        Adicionar
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={leftPopover} onOpenChange={setLeftPopover}>
              <PopoverTrigger asChild className="w-full">
                <Button className="absolute top-0 left-0 h-full w-1/3 rounded-lg border-sky-blue/30 p-0 hover:border hover:bg-sky-blue/10" variant="ghost" type="button" />
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="flex flex-col space-y-3">
                  <ToothPopover number={number} face={LEFT.includes(number) ? 'Distal' : 'Mesial'} />
                  <div className="flex h-full flex-col items-center space-y-1 md:space-y-2">
                    <p>{procedure?.procedure}</p>
                    <ProceduresSheet handleProcedure={handleProcedure} />
                  </div>
                  {procedure && (
                    <div className="flex w-full gap-2 pt-4">
                      <Button
                        size="sm"
                        className="w-1/3"
                        variant="ghost"
                        onClick={() => {
                          setProcedure(null);
                          setLeftPopover(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="w-2/3"
                        onClick={() => {
                          const tooth = getToothFace(LEFT.includes(number) ? 'Distal' : 'Mesial', procedure);
                          if (!tooth.mesial && !tooth.distal) return noProcessToast();
                          handleFace?.(number, tooth);
                          setFaces((prev) => ({ ...prev, left: true }));
                          setLeftPopover(false);
                          setProcedure(null);
                        }}
                      >
                        Adicionar
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={rightPopover} onOpenChange={setRightPopover}>
              <PopoverTrigger asChild className="w-full">
                <Button className="absolute top-0 right-0 h-full w-1/3 rounded-lg border-sky-blue/30 p-0 hover:border hover:bg-sky-blue/10" variant="ghost" type="button" />
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="flex flex-col space-y-3">
                  <ToothPopover number={number} face={LEFT.includes(number) ? 'Mesial' : 'Distal'} />
                  <div className="flex h-full flex-col items-center space-y-1 md:space-y-2">
                    <p>{procedure?.procedure}</p>
                    <ProceduresSheet handleProcedure={handleProcedure} />
                  </div>
                  {procedure && (
                    <div className="flex w-full gap-2 pt-4">
                      <Button
                        size="sm"
                        className="w-1/3"
                        variant="ghost"
                        onClick={() => {
                          setProcedure(null);
                          setRightPopover(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="w-2/3"
                        onClick={() => {
                          const tooth = getToothFace(LEFT.includes(number) ? 'Mesial' : 'Distal', procedure);
                          if (!tooth.mesial && !tooth.distal) return noProcessToast();
                          handleFace?.(number, tooth);
                          setFaces((prev) => ({ ...prev, right: true }));
                          setRightPopover(false);
                          setProcedure(null);
                        }}
                      >
                        Adicionar
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={topPopover} onOpenChange={setTopPopover}>
              <PopoverTrigger asChild className="w-full">
                <Button className="absolute top-0 left-0 h-1/3 w-full rounded-lg border-sky-blue/30 p-0 hover:border hover:bg-sky-blue/10" variant="ghost" type="button" />
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="flex flex-col space-y-3">
                  <ToothPopover number={number} face={bottom ? 'Lingual' : 'Palatal'} />
                  <div className="flex h-full flex-col items-center space-y-1 md:space-y-2">
                    <p>{procedure?.procedure}</p>
                    <ProceduresSheet handleProcedure={handleProcedure} />
                  </div>
                  {procedure && (
                    <div className="flex w-full gap-2 pt-4">
                      <Button
                        size="sm"
                        className="w-1/3"
                        variant="ghost"
                        onClick={() => {
                          setProcedure(null);
                          setTopPopover(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="w-2/3"
                        onClick={() => {
                          const tooth = getToothFace(bottom ? 'Lingual' : 'Palatal', procedure);
                          if (!tooth.lingual && !tooth.palatal) return noProcessToast();
                          handleFace?.(number, tooth);
                          setFaces((prev) => ({ ...prev, top: true }));
                          setTopPopover(false);
                          setProcedure(null);
                        }}
                      >
                        Adicionar
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={bottomPopover} onOpenChange={setBottomPopover}>
              <PopoverTrigger asChild className="w-full">
                <Button className="absolute bottom-0 left-0 h-1/3 w-full rounded-lg border-sky-blue/30 p-0 hover:border hover:bg-sky-blue/10" variant="ghost" type="button" />
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="flex flex-col space-y-3">
                  <ToothPopover number={number} face={'Facial'} />
                  <div className="flex h-full flex-col items-center space-y-1 md:space-y-2">
                    <p>{procedure?.procedure}</p>
                    <ProceduresSheet handleProcedure={handleProcedure} />
                  </div>
                  {procedure && (
                    <div className="flex w-full gap-2 pt-4">
                      <Button
                        size="sm"
                        className="w-1/3"
                        variant="ghost"
                        onClick={() => {
                          setProcedure(null);
                          setBottomPopover(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="w-2/3"
                        onClick={() => {
                          const tooth = getToothFace('Facial', procedure);
                          if (!tooth.facial) return noProcessToast();
                          handleFace?.(number, tooth);
                          setFaces((prev) => ({ ...prev, bottom: true }));
                          setBottomPopover(false);
                          setProcedure(null);
                        }}
                      >
                        Adicionar
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
