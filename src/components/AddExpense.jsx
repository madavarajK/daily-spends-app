import { useState } from 'react';
import { categories } from '../data/categories';

const getToday = () => new Date().toISOString().split('T')[0];

export default function AddExpense({ onAdd }) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(getToday);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        const numAmount = parseFloat(amount);
        if (!numAmount || numAmount <= 0) return;

        onAdd({
            amount: numAmount,
            category,
            note: note.trim(),
            date,
        });

        setAmount('');
        setNote('');
        setCategory('food');
        setDate(getToday());

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const isValid = parseFloat(amount) > 0;

    return (
        <div className="add-expense">
            {/* Toast */}
            <div className={`toast success ${showSuccess ? 'show' : ''}`}>
                ✓ Expense saved!
            </div>

            {/* Amount */}
            <div className="amount-input-wrapper">
                <div className="amount-label">Enter Amount</div>
                <div className="amount-input-row">
                    <span className="currency-symbol">₹</span>
                    <input
                        type="number"
                        className="amount-input"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        inputMode="decimal"
                        autoFocus
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="form-label">Category</label>
                <div className="category-grid">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`category-chip ${category === cat.id ? 'selected' : ''}`}
                            onClick={() => setCategory(cat.id)}
                        >
                            <span className="chip-icon">{cat.icon}</span>
                            <span className="chip-label">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Note */}
            <div>
                <label className="form-label">Note (optional)</label>
                <textarea
                    className="note-input"
                    placeholder="e.g., Lunch at cafe..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                />
            </div>

            {/* Date */}
            <div>
                <label className="form-label">Date</label>
                <input
                    type="date"
                    className="date-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            {/* Save */}
            <button className="save-btn" onClick={handleSave} disabled={!isValid}>
                Save Expense
            </button>
        </div>
    );
}
