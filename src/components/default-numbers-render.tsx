import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';

const data = [
  {
    name: 'Profit',
    value: '$287,654.00',
    change: '+8.32%',
    changeType: 'positive',
  },
  {
    name: 'Late payments',
    value: '$9,435.00',
    change: '-12.64%',
    changeType: 'negative',
  },
  {
    name: 'Pending orders',
    value: '$173,229.00',
    change: '+2.87%',
    changeType: 'positive',
  },
  {
    name: 'Operating costs',
    value: '$52,891.00',
    change: '-5.73%',
    changeType: 'negative',
  },
];

export default function Stats01() {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="mx-auto grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-2 lg:grid-cols-4">
        {data.map((stat) => (
          <Item key={stat.name} className="rounded-none border-0 bg-background p-4 shadow-none sm:p-6">
            <ItemContent className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <ItemDescription>{stat.name}</ItemDescription>
              <div className={cn('font-medium text-xs', stat.changeType === 'positive' ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400')}>
                {stat.change}
              </div>
              <ItemTitle className="w-full flex-none font-medium text-3xl tracking-tight">{stat.value}</ItemTitle>
            </ItemContent>
          </Item>
        ))}
      </div>
    </div>
  );
}
