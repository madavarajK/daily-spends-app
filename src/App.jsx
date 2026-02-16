import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import { useExpenses } from './hooks/useExpenses';

const tabs = [
  { id: 'dashboard', label: 'Home', icon: '📊' },
  { id: 'add', label: 'Add', icon: '+' },
  { id: 'expenses', label: 'History', icon: '📋' },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    addExpense,
    deleteExpense,
    getExpensesByDate,
    getExpensesByRange,
    getTotalByDate,
    getTotalByRange,
    getCategoryTotals,
  } = useExpenses();

  const today = new Date();
  const dateDisplay = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleAdd = (expense) => {
    addExpense(expense);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            getTotalByDate={getTotalByDate}
            getTotalByRange={getTotalByRange}
            getCategoryTotals={getCategoryTotals}
            getExpensesByDate={getExpensesByDate}
            getExpensesByRange={getExpensesByRange}
          />
        );
      case 'add':
        return <AddExpense onAdd={handleAdd} />;
      case 'expenses':
        return (
          <ExpenseList
            getExpensesByDate={getExpensesByDate}
            getTotalByDate={getTotalByDate}
            onDelete={deleteExpense}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>💰 Daily Spends</h1>
        <div className="date-display">{dateDisplay}</div>
      </header>

      {/* Content */}
      <main className="app-content" key={activeTab}>
        {renderContent()}
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${tab.id === 'add' ? 'add-btn' : ''} ${activeTab === tab.id ? 'active' : ''
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
