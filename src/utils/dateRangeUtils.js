import { subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export const dateRangePresets = {
  today: {
    label: 'Today',
    getRange: () => {
      const today = new Date();
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };
    },
  },
  yesterday: {
    label: 'Yesterday',
    getRange: () => {
      const yesterday = subDays(new Date(), 1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday),
      };
    },
  },
  thisWeek: {
    label: 'This Week',
    getRange: () => {
      const today = new Date();
      return {
        start: startOfWeek(today, { weekStartsOn: 1 }), // Monday
        end: endOfWeek(today, { weekStartsOn: 1 }),
      };
    },
  },
  lastWeek: {
    label: 'Last Week',
    getRange: () => {
      const today = new Date();
      const lastWeek = subDays(today, 7);
      return {
        start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      };
    },
  },
  thisMonth: {
    label: 'This Month',
    getRange: () => {
      const today = new Date();
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };
    },
  },
  lastMonth: {
    label: 'Last Month',
    getRange: () => {
      const today = new Date();
      const lastMonth = subDays(today, 30);
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      };
    },
  },
  thisYear: {
    label: 'This Year',
    getRange: () => {
      const today = new Date();
      return {
        start: startOfYear(today),
        end: endOfYear(today),
      };
    },
  },
  all: {
    label: 'All Time',
    getRange: () => ({
      start: null,
      end: null,
    }),
  },
};

export const filterByDateRange = (items, dateRange) => {
  if (!dateRange || (!dateRange.start && !dateRange.end)) {
    return items;
  }

  return items.filter(item => {
    const itemDate = new Date(item.date);
    if (dateRange.start && itemDate < dateRange.start) return false;
    if (dateRange.end && itemDate > dateRange.end) return false;
    return true;
  });
};

