import type { Expense, Participant, ParticipantSummary, Settlement } from '../types';

export const calculateSummary = (
  participants: Participant[],
  expenses: Expense[]
): ParticipantSummary[] => {
  return participants.map((p) => {
    // Calculate how much this participant paid
    const paid = expenses
      .filter((e) => e.paidBy === p.id)
      .reduce((sum, e) => sum + e.amount, 0);

    // Calculate how much this participant owes (their share of expenses)
    let owes = 0;
    expenses.forEach((expense) => {
      const splitParticipants = expense.splitBetween || participants.map(pt => pt.id);

      // Only count if this participant is in the split
      if (splitParticipants.includes(p.id)) {
        owes += expense.amount / splitParticipants.length;
      }
    });

    return {
      id: p.id,
      name: p.name,
      paid,
      share: owes,
      balance: paid - owes,
    };
  });
};

export const calculateSettlement = (
  participants: Participant[],
  expenses: Expense[]
): Settlement[] => {
  const summary = calculateSummary(participants, expenses);

  // Build mutable balances
  const balances: { id: string; name: string; balance: number }[] = summary.map((s) => ({
    id: s.id,
    name: s.name,
    balance: Math.round(s.balance),
  }));

  const settlements: Settlement[] = [];

  // Greedy algorithm: match debtors with creditors
  const debtors = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);
  const creditors = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

    if (amount > 0) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount,
      });
    }

    debtor.balance += amount;
    creditor.balance -= amount;

    if (Math.abs(debtor.balance) < 1) i++;
    if (creditor.balance < 1) j++;
  }

  return settlements;
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
