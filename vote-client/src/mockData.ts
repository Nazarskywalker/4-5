import { Poll } from './types';

export const mockPolls: Poll[] = [
  {
    id: 1,
    title: 'Яке ваше улюблене місто?',
    votes: [
      { id: 1, poll_id: 1, option: 'Київ' },
      { id: 2, poll_id: 1, option: 'Львів' },
      { id: 3, poll_id: 1, option: 'Одеса' },
      { id: 4, poll_id: 1, option: 'Харків' }
    ]
  },
  {
    id: 2,
    title: 'Який ваш улюблений колір?',
    votes: [
      { id: 5, poll_id: 2, option: 'Синій' },
      { id: 6, poll_id: 2, option: 'Червоний' },
      { id: 7, poll_id: 2, option: 'Зелений' },
      { id: 8, poll_id: 2, option: 'Жовтий' }
    ]
  }
];
