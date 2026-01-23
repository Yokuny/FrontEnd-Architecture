import { Separator } from '@/components/ui/separator';

interface ConsumptionCO2TotalsProps {
  totals: {
    totalFuel: number;
    totalCO2: number;
    fuelTypeTotals: Record<string, number>;
  };
  selectedUnit: string;
}

export function ConsumptionCO2Totals({ totals, selectedUnit }: ConsumptionCO2TotalsProps) {
  return (
    <div className="fade-in slide-in-from-bottom-2 flex animate-in flex-wrap gap-12 rounded-xl border bg-secondary/30 p-8 duration-500">
      <div className="flex flex-col">
        <span className="mb-3 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Total Consumption</span>
        <div className="flex flex-col gap-2">
          {Object.keys(totals.fuelTypeTotals).length > 1 ? (
            Object.entries(totals.fuelTypeTotals).map(([fuel, value]) => (
              <div key={fuel} className="flex items-center gap-3">
                <span className="w-12 font-bold text-[10px] text-muted-foreground">{fuel}</span>
                <span className="font-bold font-mono text-foreground text-xl">
                  {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-muted-foreground text-xs">{selectedUnit}</span>
                </span>
              </div>
            ))
          ) : (
            <span className="font-bold font-mono text-3xl text-foreground tracking-tighter">
              {totals.totalFuel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="font-medium text-base text-muted-foreground uppercase">{selectedUnit}</span>
            </span>
          )}
        </div>
      </div>

      <Separator orientation="vertical" className="hidden h-16 md:block" />

      <div className="flex flex-col">
        <span className="mb-3 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Total CO₂ (KG)</span>
        <span className="font-bold font-mono text-3xl text-foreground tracking-tighter">
          {totals.totalCO2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="font-medium text-base text-muted-foreground uppercase">KG</span>
        </span>
      </div>

      <Separator orientation="vertical" className="hidden h-16 md:block" />

      <div className="flex flex-col">
        <span className="mb-3 font-bold text-[10px] text-primary uppercase tracking-widest">Total CO₂ (Ton)</span>
        <span className="font-bold font-mono text-3xl text-primary tracking-tighter">
          {(totals.totalCO2 / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="font-medium text-base text-primary/70 uppercase">TON</span>
        </span>
      </div>
    </div>
  );
}
