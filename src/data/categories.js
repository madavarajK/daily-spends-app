export const categories = [
  { id: 'food', name: 'Food', icon: '🍔', color: '#FF6B6B' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#4ECDC4' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#A78BFA' },
  { id: 'bills', name: 'Bills', icon: '📄', color: '#F59E0B' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: '#EC4899' },
  { id: 'health', name: 'Health', icon: '💊', color: '#10B981' },
  { id: 'education', name: 'Education', icon: '📚', color: '#3B82F6' },
  { id: 'other', name: 'Other', icon: '📌', color: '#6B7280' },
];

export const getCategoryById = (id) => {
  return categories.find((cat) => cat.id === id) || categories[categories.length - 1];
};
