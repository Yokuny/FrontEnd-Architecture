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
    <div className="p-8 rounded-xl border bg-secondary/30 flex flex-wrap gap-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-3">Total Consumption</span>
        <div className="flex flex-col gap-2">
          {Object.keys(totals.fuelTypeTotals).length > 1 ? (
            Object.entries(totals.fuelTypeTotals).map(([fuel, value]) => (
              <div key={fuel} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground font-bold w-12">{fuel}</span>
                <span className="text-xl font-mono font-bold text-foreground">
                  {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-xs text-muted-foreground">{selectedUnit}</span>
                </span>
              </div>
            ))
          ) : (
            <span className="text-3xl font-mono font-bold text-foreground tracking-tighter">
              {totals.totalFuel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-base text-muted-foreground font-medium uppercase">{selectedUnit}</span>
            </span>
          )}
        </div>
      </div>

      <Separator orientation="vertical" className="h-16 hidden md:block" />

      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-3">Total CO₂ (KG)</span>
        <span className="text-3xl font-mono font-bold text-foreground tracking-tighter">
          {totals.totalCO2.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-base text-muted-foreground font-medium uppercase">KG</span>
        </span>
      </div>

      <Separator orientation="vertical" className="h-16 hidden md:block" />

      <div className="flex flex-col">
        <span className="text-[10px] text-primary uppercase font-bold tracking-widest mb-3">Total CO₂ (Ton)</span>
        <span className="text-3xl font-mono font-bold text-primary tracking-tighter">
          {(totals.totalCO2 / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-base text-primary/70 font-medium uppercase">TON</span>
        </span>
      </div>
    </div>
  );
}
