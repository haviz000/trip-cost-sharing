import { useState, useCallback, useEffect } from 'react';
import type { AppState, Trip, Participant, Expense } from '../types';
import { storageService } from '../services/storage';



export const useAppStore = () => {
  const [state, setState] = useState<AppState>(() => storageService.load());

  useEffect(() => {
    storageService.save(state);
  }, [state]);

  // Trip operations
  const createTrip = useCallback((name: string, description: string) => {
    const trip: Trip = {
      id: `trip-${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString(),
      participants: [],
      expenses: [],
    };
    setState((prev) => ({ ...prev, trips: [trip, ...prev.trips] }));
    return trip.id;
  }, []);

  const updateTrip = useCallback((id: string, name: string, description: string) => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) => (t.id === id ? { ...t, name, description } : t)),
    }));
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setState((prev) => ({ ...prev, trips: prev.trips.filter((t) => t.id !== id) }));
  }, []);

  // Participant operations
  const addParticipant = useCallback((tripId: string, name: string) => {
    const participant: Participant = { id: `p-${Date.now()}`, name };
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) =>
        t.id === tripId ? { ...t, participants: [...t.participants, participant] } : t
      ),
    }));
  }, []);

  const updateParticipant = useCallback((tripId: string, participantId: string, name: string) => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) =>
        t.id === tripId
          ? {
              ...t,
              participants: t.participants.map((p) =>
                p.id === participantId ? { ...p, name } : p
              ),
            }
          : t
      ),
    }));
  }, []);

  const deleteParticipant = useCallback((tripId: string, participantId: string) => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) =>
        t.id === tripId
          ? {
              ...t,
              participants: t.participants.filter((p) => p.id !== participantId),
              expenses: t.expenses.filter((e) => e.paidBy !== participantId),
            }
          : t
      ),
    }));
  }, []);

  // Expense operations
  const addExpense = useCallback(
    (tripId: string, data: Omit<Expense, 'id' | 'createdAt'>) => {
      const expense: Expense = {
        id: `e-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        trips: prev.trips.map((t) =>
          t.id === tripId ? { ...t, expenses: [...t.expenses, expense] } : t
        ),
      }));
    },
    []
  );

  const updateExpense = useCallback(
    (tripId: string, expenseId: string, data: Omit<Expense, 'id' | 'createdAt'>) => {
      setState((prev) => ({
        ...prev,
        trips: prev.trips.map((t) =>
          t.id === tripId
            ? {
                ...t,
                expenses: t.expenses.map((e) =>
                  e.id === expenseId ? { ...e, ...data } : e
                ),
              }
            : t
        ),
      }));
    },
    []
  );

  const deleteExpense = useCallback((tripId: string, expenseId: string) => {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) =>
        t.id === tripId
          ? { ...t, expenses: t.expenses.filter((e) => e.id !== expenseId) }
          : t
      ),
    }));
  }, []);

  // Export/Import operations
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tripsplit-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [state]);

  const importData = useCallback((data: AppState) => {
    setState(data);
  }, []);

  return {
    trips: state.trips,
    createTrip,
    updateTrip,
    deleteTrip,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    addExpense,
    updateExpense,
    deleteExpense,
    exportData,
    importData,
  };
};
