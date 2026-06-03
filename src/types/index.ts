export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  participants: Participant[];
  expenses: Expense[];
}

export interface AppState {
  trips: Trip[];
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface ParticipantSummary {
  id: string;
  name: string;
  paid: number;
  share: number;
  balance: number;
}
