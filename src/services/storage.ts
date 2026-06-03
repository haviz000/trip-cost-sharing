import type { AppState, Trip } from '../types';

const STORAGE_KEY = 'trip-cost-sharing';

export const loadState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    return JSON.parse(raw) as AppState;
  } catch {
    return getInitialState();
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error('Failed to save state to localStorage');
  }
};

const getInitialState = (): AppState => {
  const seedData: AppState = {
    // trips: [
    //   // {
    //   //   id: 'trip-1',
    //   //   name: 'Bali Trip 2026',
    //   //   description: 'A fun beach getaway to Bali with the crew',
    //   //   createdAt: '2026-03-01T00:00:00.000Z',
    //   //   participants: [
    //   //     { id: 'p1', name: 'Andi' },
    //   //     { id: 'p2', name: 'Budi' },
    //   //     { id: 'p3', name: 'Citra' },
    //   //     { id: 'p4', name: 'Dewa' },
    //   //     { id: 'p5', name: 'Eka' },
    //   //   ],
    //   //   expenses: [
    //   //     { id: 'e1', title: 'Fuel', amount: 500000, paidBy: 'p1', createdAt: '2026-03-02T08:00:00.000Z' },
    //   //     { id: 'e2', title: 'Fuel (Return)', amount: 200000, paidBy: 'p2', createdAt: '2026-03-02T09:00:00.000Z' },
    //   //     { id: 'e3', title: 'Dinner', amount: 150000, paidBy: 'p3', createdAt: '2026-03-02T20:00:00.000Z' },
    //   //     { id: 'e4', title: 'Hotel', amount: 2000000, paidBy: 'p3', createdAt: '2026-03-03T14:00:00.000Z' },
    //   //     { id: 'e5', title: 'Surfing', amount: 4000000, paidBy: 'p4', createdAt: '2026-03-04T09:00:00.000Z' },
    //   //     { id: 'e6', title: 'Souvenirs', amount: 1000000, paidBy: 'p5', createdAt: '2026-03-05T16:00:00.000Z' },
    //   //   ],
    //   // },
    //   // {
    //   //   id: 'trip-2',
    //   //   name: 'Bromo Trip',
    //   //   description: 'Sunrise adventure at Mount Bromo',
    //   //   createdAt: '2026-04-10T00:00:00.000Z',
    //   //   participants: [
    //   //     { id: 'p6', name: 'Farel' },
    //   //     { id: 'p7', name: 'Gina' },
    //   //     { id: 'p8', name: 'Hadi' },
    //   //   ],
    //   //   expenses: [
    //   //     { id: 'e7', title: 'Jeep Rental', amount: 900000, paidBy: 'p6', createdAt: '2026-04-11T04:00:00.000Z' },
    //   //     { id: 'e8', title: 'Hotel', amount: 600000, paidBy: 'p7', createdAt: '2026-04-10T18:00:00.000Z' },
    //   //     { id: 'e9', title: 'Food & Drinks', amount: 300000, paidBy: 'p8', createdAt: '2026-04-11T12:00:00.000Z' },
    //   //   ],
    //   // },
    // ],

    trips: [],
  };
  saveState(seedData);
  return seedData;
};

export const storageService = {
  load: loadState,
  save: saveState,
};

export const getTripById = (trips: Trip[], id: string): Trip | undefined =>
  trips.find((t) => t.id === id);
