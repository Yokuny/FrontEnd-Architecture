type ToothStatus = 'normal' | 'missing' | 'extracted' | 'periodontitis' | 'caries' | 'prosthesis' | 'implant';

type ToothProps = {
  toothNumber: number;
  status?: ToothStatus;
  TeethComponents: Record<string, React.ComponentType<{ fill?: string }>>;
};

const ToothByNumber = (toothNumber: number, status: ToothStatus | undefined, TeethComponents: Record<string, React.ComponentType<{ fill?: string }>>) => {
  const isInactive = ['missing', 'extracted'].includes(status || 'normal');
  const hasProblem = ['periodontitis', 'caries'].includes(status || 'normal');
  const hasReplacement = ['prosthesis', 'implant'].includes(status || 'normal');

  const getProps = () => ({
    className: isInactive ? 'text-accent' : 'text-zinc-800/30 dark:text-zinc-100/60',
    fill: hasProblem ? 'oklch(96.2% 0.059 95.617)' : hasReplacement ? 'oklch(92.3% 0.003 48.717)' : 'none',
  });

  const toothMap: Record<number, { component: string; mirror?: boolean }> = {
    11: { component: 'teeth11_21_51_61' },
    51: { component: 'teeth11_21_51_61' },
    12: { component: 'teeth12_22_52_62' },
    52: { component: 'teeth12_22_52_62' },
    13: { component: 'teeth13_23_53_63' },
    53: { component: 'teeth13_23_53_63' },
    14: { component: 'teeth14_24' },
    15: { component: 'teeth15_25' },
    16: { component: 'teeth16_26_54_64' },
    54: { component: 'teeth16_26_54_64' },
    17: { component: 'teeth17_27_55_65' },
    55: { component: 'teeth17_27_55_65' },
    18: { component: 'teeth18_28' },
    21: { component: 'teeth11_21_51_61', mirror: true },
    61: { component: 'teeth11_21_51_61', mirror: true },
    22: { component: 'teeth12_22_52_62', mirror: true },
    62: { component: 'teeth12_22_52_62', mirror: true },
    23: { component: 'teeth13_23_53_63', mirror: true },
    63: { component: 'teeth13_23_53_63', mirror: true },
    24: { component: 'teeth14_24', mirror: true },
    25: { component: 'teeth15_25', mirror: true },
    26: { component: 'teeth16_26_54_64', mirror: true },
    64: { component: 'teeth16_26_54_64', mirror: true },
    27: { component: 'teeth17_27_55_65', mirror: true },
    65: { component: 'teeth17_27_55_65', mirror: true },
    28: { component: 'teeth18_28', mirror: true },
    31: { component: 'teeth31_41_71_81' },
    71: { component: 'teeth31_41_71_81' },
    32: { component: 'teeth32_42_72_82' },
    72: { component: 'teeth32_42_72_82' },
    33: { component: 'teeth33_43_73_83' },
    73: { component: 'teeth33_43_73_83' },
    34: { component: 'teeth34_44' },
    35: { component: 'teeth35_45' },
    36: { component: 'teeth36_46_74_84' },
    74: { component: 'teeth36_46_74_84' },
    37: { component: 'teeth37_47_75_85' },
    75: { component: 'teeth37_47_75_85' },
    38: { component: 'teeth38_48' },
    41: { component: 'teeth31_41_71_81', mirror: true },
    81: { component: 'teeth31_41_71_81', mirror: true },
    42: { component: 'teeth32_42_72_82', mirror: true },
    82: { component: 'teeth32_42_72_82', mirror: true },
    43: { component: 'teeth33_43_73_83', mirror: true },
    83: { component: 'teeth33_43_73_83', mirror: true },
    44: { component: 'teeth34_44', mirror: true },
    45: { component: 'teeth35_45', mirror: true },
    46: { component: 'teeth36_46_74_84', mirror: true },
    84: { component: 'teeth36_46_74_84', mirror: true },
    47: { component: 'teeth37_47_75_85', mirror: true },
    85: { component: 'teeth37_47_75_85', mirror: true },
    48: { component: 'teeth38_48', mirror: true },
  };

  const config = toothMap[toothNumber] || { component: 'teeth38_48', mirror: true };
  const Component = TeethComponents[config.component];

  if (!Component) return null;

  return (
    <div className={getProps().className} style={config.mirror ? { transform: 'scale(-1, 1)' } : undefined}>
      <Component fill={getProps().fill} />
    </div>
  );
};

const ToothNumber = ({ toothNumber, status, TeethComponents }: ToothProps) => {
  return <div className="aspect-auto h-auto w-7">{ToothByNumber(toothNumber, status, TeethComponents)}</div>;
};

export default ToothNumber;
