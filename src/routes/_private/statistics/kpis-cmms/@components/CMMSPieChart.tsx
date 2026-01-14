import { useTranslation } from 'react-i18next';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface CMMSPieChartProps {
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
}

export function CMMSPieChart({ title, data, colors }: CMMSPieChartProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="text-sm font-bold text-center">{title}</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
