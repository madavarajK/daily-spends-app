import { useState } from 'react';
import ExpenseCard from './ExpenseCard';

const formatDateDisplay = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';

    return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const getToday = () => new Date().toISOString().split('T')[0];

export default function ExpenseList({ getExpensesByDate, getTotalByDate, onDelete }) {
    const [selectedDate, setSelectedDate] = useState(getToday);

    const expenses = getExpensesByDate(selectedDate);
    const total = getTotalByDate(selectedDate);

    const navigateDate = (dir) => {
        const d = new Date(selectedDate + 'T00:00:00');
        d.setDate(d.getDate() + dir);
        setSelectedDate(d.toISOString().split('T')[0]);
    };

    return (
        <div className="expense-list">
            {/* Date nav */}
            <div className="date-nav">
                <button className="date-nav-btn" onClick={() => navigateDate(-1)}>
                    ‹
                </button>
                <div className="date-text">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {formatDateDisplay(selectedDate)}
                    </div>
                </div>
                <button className="date-nav-btn" onClick={() => navigateDate(1)}>
                    ›
                </button>
            </div>

            {/* Daily total */}
            <div className="daily-total">
                <div className="total-label">Daily Total</div>
                <div className="total-value">
                    ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>
            </div>

            {/* Expense items */}
            {expenses.length > 0 ? (
                <div className="expenses-items">
                    {expenses.map((exp) => (
                        <ExpenseCard key={exp.id} expense={exp} onDelete={onDelete} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <div className="empty-text">No expenses for this day</div>
                    <div className="empty-sub">Tap + to add one</div>
                </div>
            )}
        </div>
    );
}
