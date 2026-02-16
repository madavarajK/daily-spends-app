import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'daily-spends-data';

const loadExpenses = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveExpenses = (expenses) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};

export const useExpenses = () => {
    const [expenses, setExpenses] = useState(loadExpenses);

    useEffect(() => {
        saveExpenses(expenses);
    }, [expenses]);

    const addExpense = useCallback((expense) => {
        const newExpense = {
            ...expense,
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            createdAt: new Date().toISOString(),
        };
        setExpenses((prev) => [newExpense, ...prev]);
        return newExpense;
    }, []);

    const deleteExpense = useCallback((id) => {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
    }, []);

    const getExpensesByDate = useCallback(
        (dateStr) => {
            return expenses.filter((e) => e.date === dateStr);
        },
        [expenses]
    );

    const getExpensesByRange = useCallback(
        (startDate, endDate) => {
            return expenses.filter((e) => e.date >= startDate && e.date <= endDate);
        },
        [expenses]
    );

    const getTotalByDate = useCallback(
        (dateStr) => {
            return getExpensesByDate(dateStr).reduce((sum, e) => sum + e.amount, 0);
        },
        [getExpensesByDate]
    );

    const getTotalByRange = useCallback(
        (startDate, endDate) => {
            return getExpensesByRange(startDate, endDate).reduce((sum, e) => sum + e.amount, 0);
        },
        [getExpensesByRange]
    );

    const getCategoryTotals = useCallback(
        (startDate, endDate) => {
            const filtered = endDate
                ? getExpensesByRange(startDate, endDate)
                : getExpensesByDate(startDate);
            const totals = {};
            filtered.forEach((e) => {
                totals[e.category] = (totals[e.category] || 0) + e.amount;
            });
            return totals;
        },
        [getExpensesByDate, getExpensesByRange]
    );

    return {
        expenses,
        addExpense,
        deleteExpense,
        getExpensesByDate,
        getExpensesByRange,
        getTotalByDate,
        getTotalByRange,
        getCategoryTotals,
    };
};
