import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useAppStore } from './store/useAppStore';
import TripListPage from './pages/TripListPage';
import TripDetailPage from './pages/TripDetailPage';
import type { Expense } from './types';

const App: React.FC = () => {
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const store = useAppStore();

  const activeTrip = activeTripId ? store.trips.find((t) => t.id === activeTripId) || null : null;

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#FF6B35',
          colorBgBase: '#0F1117',
          colorBgContainer: '#1A1D2E',
          borderRadius: 10,
          fontFamily: "'Sora', 'Inter', sans-serif",
        },
        components: {
          Card: { colorBgContainer: '#1A1D2E' },
          Table: { colorBgContainer: 'transparent' },
          Modal: { contentBg: '#1A1D2E', headerBg: '#1A1D2E' },
        },
      }}
    >
      {activeTrip ? (
        <TripDetailPage
          trip={activeTrip}
          onBack={() => setActiveTripId(null)}
          onAddParticipant={(name) => store.addParticipant(activeTrip.id, name)}
          onUpdateParticipant={(id, name) => store.updateParticipant(activeTrip.id, id, name)}
          onDeleteParticipant={(id) => store.deleteParticipant(activeTrip.id, id)}
          onAddExpense={(data) => store.addExpense(activeTrip.id, data)}
          onUpdateExpense={(id, data: Omit<Expense, 'id' | 'createdAt'>) =>
            store.updateExpense(activeTrip.id, id, data)
          }
          onDeleteExpense={(id) => store.deleteExpense(activeTrip.id, id)}
        />
      ) : (
        <TripListPage
          trips={store.trips}
          onSelectTrip={setActiveTripId}
          onCreateTrip={(name, desc) => store.createTrip(name, desc)}
          onUpdateTrip={(id, name, desc) => store.updateTrip(id, name, desc)}
          onDeleteTrip={(id) => store.deleteTrip(id)}
          onExportData={store.exportData}
          onImportData={store.importData}
        />
      )}
    </ConfigProvider>
  );
};

export default App;
