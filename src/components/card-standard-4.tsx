import { faker } from '@faker-js/faker';
import { Bath, Bed, Maximize } from 'lucide-react';

import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';

export const title = 'Image Card';

const price = faker.commerce.price({ min: 100_000, max: 500_000, dec: 0 });
const beds = faker.number.int({ min: 2, max: 5 });
const baths = faker.number.int({ min: 1, max: 3 });
const area = faker.number.int({ min: 200, max: 500 });

const Example = () => (
  <Item variant="outline" className="flex-col items-stretch w-full max-w-md overflow-hidden p-0">
    <ItemHeader className="flex-col items-start gap-1 p-6">
      <ItemTitle className="text-xl">3-Bedroom House</ItemTitle>
      <ItemDescription>A luxurious 3-bedroom house with a modern design.</ItemDescription>
    </ItemHeader>
    <ItemContent className="p-0">
      <img
        alt=""
        height={1380}
        src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        width={2070}
        className="w-full object-cover"
      />
    </ItemContent>
    <ItemFooter className="flex items-center justify-between p-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border px-4 py-2">
          <Bed className="size-4" />
          <span className="font-medium text-sm">{beds}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border px-4 py-2">
          <Bath className="size-4" />
          <span className="font-medium text-sm">{baths}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border px-4 py-2">
          <Maximize className="size-4" />
          <span className="font-medium text-sm">{area}m²</span>
        </div>
      </div>
      <p className="font-bold text-2xl">${Number(price).toLocaleString()}</p>
    </ItemFooter>
  </Item>
);

export default Example;
