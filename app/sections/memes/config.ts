export interface Filter {
  value: string;
  label: string;
  order: Order;
}

export interface Tab {
  value: string;
  label: string;
  filters?: Filter[];
  icon?: string;
  iconSize?: number;
}

export enum Order {
  Asc = 'asc',
  Desc = 'desc',
}

export const TABS: Tab[] = [
  {
    value: 'hot',
    label: 'Hot',
    filters: [
      { value: 'virtual_volume', label: 'Volume', order: Order.Desc },
      { value: 'market_cap', label: 'MCap', order: Order.Desc },
      { value: 'holder', label: 'Holders', order: Order.Desc },
    ],
  },
  {
    value: 'genesis',
    label: 'Genesis',
    filters: [
      { value: 'likes', label: 'Likes', order: Order.Desc },
      { value: 'flips', label: 'Flips', order: Order.Desc },
      { value: 'latest', label: 'Latest', order: Order.Desc },
    ],
  },
  {
    value: 'ticking',
    label: 'Ticking',
    filters: [
      { value: 'almost', label: 'Almost', order: Order.Desc },
      { value: 'volume', label: 'Volume', order: Order.Desc },
      { value: 'mcap', label: 'MCap', order: Order.Desc },
      { value: 'holders', label: 'Holders', order: Order.Desc },
      { value: 'latest', label: 'Latest', order: Order.Desc },
    ],
  },
  {
    value: 'listed',
    label: 'Listed',
    filters: [
      { value: 'volume', label: 'Volume', order: Order.Desc },
      { value: 'mcap', label: 'MCap', order: Order.Desc },
      { value: 'holders', label: 'Holders', order: Order.Desc },
      { value: 'latest', label: 'Latest', order: Order.Desc },
    ],
  },
  {
    value: 'import',
    label: 'Import',
    icon: '/img/memes/pump.svg',
    iconSize: 12,
  },
];
