const STORAGE_KEY = 'stock-portfolio-data';

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {
      openingBalance: 0,
      trades: [],
      cashFlows: [],
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      openingBalance: 0,
      trades: [],
      cashFlows: [],
    };
  }
};

