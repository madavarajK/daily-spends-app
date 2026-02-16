import { getCategoryById } from '../data/categories';

export default function ExpenseCard({ expense, onDelete }) {
    const cat = getCategoryById(expense.category);
    const time = new Date(expense.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="expense-card">
            <div
                className="card-icon"
                style={{ background: `${cat.color}20` }}
            >
                {cat.icon}
            </div>
            <div className="card-details">
                <div className="card-category">{cat.name}</div>
                {expense.note && <div className="card-note">{expense.note}</div>}
                <div className="card-time">{time}</div>
            </div>
            <div className="card-right">
                <div className="card-amount" style={{ color: cat.color }}>
                    ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>
                <button
                    className="delete-btn"
                    onClick={() => onDelete(expense.id)}
                    title="Delete"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
