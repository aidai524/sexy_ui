export const TABS = [
  {
    value: 1,
    label: 'Hot',
    filters: [
      { value: 'volume', label: 'Volume', sort: 'asc' },
      { value: 'market_cap', label: 'MCap', sort: 'asc' },
      { value: 'holders', label: 'Holders', sort: 'asc' },
    ],
  },
  {
    value: 2,
    label: 'Genesis',
    filters: [
      { value: 'to_the_end', label: 'To the end', sort: 'asc' },
      { value: 'latest', label: 'Latest', sort: 'asc' },
      { value: 'likes', label: 'Likes', sort: 'asc' },
      { value: 'flips', label: 'Flips', sort: 'asc' },
    ],
  },
  {
    value: 3,
    label: 'Ticking',
  },
  {
    value: 4,
    label: 'Listed',
  },
  {
    value: 5,
    label: 'Import',
    icon: '/img/memes/pump.svg',
    iconSize: 12,
  },
];
