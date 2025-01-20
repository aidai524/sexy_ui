export const LEVELS: Record<string, { value: number; label: string; theme: string; icon: string; }> = {
  1: {
    value: 1,
    label: 'Lv.1',
    theme: 'linear-gradient(180deg, #A4A4A4 0%, #313131 100%)',
    icon: '/img/levels/level-1.svg',
  },
  2: {
    value: 2,
    label: 'Lv.2',
    theme: 'linear-gradient(153deg, #C029C7 18.09%, #5200B8 92.78%)',
    icon: '/img/levels/level-4.svg',
  },
  3: {
    value: 3,
    label: 'Lv.3',
    theme: 'linear-gradient(153deg, #C029C7 18.09%, #5200B8 92.78%)',
    icon: '/img/levels/level-4.svg',
  },
  4: {
    value: 4,
    label: 'Lv.4',
    theme: 'linear-gradient(153deg, #C029C7 18.09%, #5200B8 92.78%)',
    icon: '/img/levels/level-4.svg',
  },
  5: {
    value: 5,
    label: 'Lv.5',
    theme: 'linear-gradient(153deg, #C029C7 18.09%, #5200B8 92.78%)',
    icon: '/img/levels/level-4.svg',
  },
};

export const getCurrentLevel = (level: any) => {
  return LEVELS[level] || LEVELS[0];
};
