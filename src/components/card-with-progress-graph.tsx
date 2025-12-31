import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Progress } from '@/components/ui/progress';

const data = [
  {
    name: 'Requests',
    stat: '996',
    limit: '10,000',
    percentage: 9.96,
  },
  {
    name: 'Storage',
    stat: '1.85',
    limit: '10GB',
    percentage: 18.5,
  },
  {
    name: 'API Calls',
    stat: '4,328',
    limit: '5,000',
    percentage: 86.56,
  },
];

export default function Stats09() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {data.map((item) => (
        <Item key={item.name} variant="outline" className="py-4 bg-background">
          <ItemContent>
            <ItemDescription>{item.name}</ItemDescription>
            <ItemTitle className="text-2xl font-semibold break-all">{item.stat}</ItemTitle>
            <Progress value={item.percentage} className="mt-6 h-2" />
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-primary">{item.percentage}&#37;</span>
              <ItemDescription className="line-clamp-none">
                {item.stat} of {item.limit}
              </ItemDescription>
            </div>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
