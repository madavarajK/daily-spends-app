import { useMemo } from 'react';
import { categories, getCategoryById } from '../data/categories';

const getToday = () => new Date().toISOString().split('T')[0];

const getDaysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
};

const getMonthStart = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Dashboard({
    getTotalByDate,
    getTotalByRange,
    getCategoryTotals,
    getExpensesByDate,
    getExpensesByRange,
}) {
    const today = getToday();
    const weekStart = getDaysAgo(6);
    const monthStart = getMonthStart();

    const todayTotal = getTotalByDate(today);
    const weekTotal = getTotalByRange(weekStart, today);
    const monthTotal = getTotalByRange(monthStart, today);

    const todayExpenses = getExpensesByDate(today);
    const weekExpenses = getExpensesByRange(weekStart, today);
    const monthExpenses = getExpensesByRange(monthStart, today);

    // Daily average this month
    const daysInMonth = Math.max(1, Math.ceil((new Date() - new Date(monthStart)) / 86400000) + 1);
    const dailyAvg = monthTotal / daysInMonth;

    // Category breakdown for this month
    const catTotals = getCategoryTotals(monthStart, today);
    const maxCat = Math.max(...Object.values(catTotals), 1);
    const sortedCats = Object.entries(catTotals)
        .sort(([, a], [, b]) => b - a);

    // Weekly chart data
    const weeklyData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = getDaysAgo(i);
            const d = new Date(date + 'T00:00:00');
            const total = getTotalByDate(date);
            data.push({
                date,
                day: DAY_LABELS[d.getDay()],
                total,
                isToday: i === 0,
            });
        }
        return data;
    }, [getTotalByDate]);

    const maxWeekly = Math.max(...weeklyData.map((d) => d.total), 1);

    const formatNum = (n) =>
        n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    return (
        <div className="dashboard">
            {/* Summary cards */}
            <div className="summary-cards">
                <div className="summary-card today">
                    <div className="card-label">Today</div>
                    <div className="card-value">₹{formatNum(todayTotal)}</div>
                    <div className="card-count">{todayExpenses.length} transaction{todayExpenses.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="summary-card week">
                    <div className="card-label">This Week</div>
                    <div className="card-value">₹{formatNum(weekTotal)}</div>
                    <div className="card-count">{weekExpenses.length} transaction{weekExpenses.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="summary-card month">
                    <div className="card-label">This Month</div>
                    <div className="card-value">₹{formatNum(monthTotal)}</div>
                    <div className="card-count">{monthExpenses.length} transaction{monthExpenses.length !== 1 ? 's' : ''}</div>
                </div>
                <div className="summary-card avg">
                    <div className="card-label">Daily Avg</div>
                    <div className="card-value">₹{formatNum(dailyAvg)}</div>
                    <div className="card-count">this month</div>
                </div>
            </div>

            {/* Weekly chart */}
            <div className="section-header">Last 7 Days</div>
            <div className="weekly-chart">
                {weeklyData.map((d) => (
                    <div className="chart-bar-wrapper" key={d.date}>
                        <div className="chart-bar-amount">
                            {d.total > 0 ? `₹${formatNum(d.total)}` : ''}
                        </div>
                        <div
                            className={`chart-bar ${d.isToday ? 'today-bar' : ''}`}
                            style={{ height: `${Math.max((d.total / maxWeekly) * 70, 2)}%` }}
                        />
                        <div className={`chart-bar-label ${d.isToday ? 'today-label' : ''}`}>
                            {d.day}
                        </div>
                    </div>
                ))}
            </div>

            {/* Category breakdown */}
            {sortedCats.length > 0 && (
                <>
                    <div className="section-header">By Category</div>
                    <div className="category-breakdown">
                        {sortedCats.map(([catId, total]) => {
                            const cat = getCategoryById(catId);
                            return (
                                <div className="category-row" key={catId}>
                                    <div className="cat-icon" style={{ background: `${cat.color}18` }}>
                                        {cat.icon}
                                    </div>
                                    <div className="cat-info">
                                        <div className="cat-name">{cat.name}</div>
                                        <div className="cat-bar-track">
                                            <div
                                                className="cat-bar-fill"
                                                style={{
                                                    width: `${(total / maxCat) * 100}%`,
                                                    background: cat.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="cat-amount" style={{ color: cat.color }}>
                                        ₹{formatNum(total)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {sortedCats.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <div className="empty-text">No expense data yet</div>
                    <div className="empty-sub">Start adding expenses to see insights</div>
                </div>
            )}
        </div>
    );
}
