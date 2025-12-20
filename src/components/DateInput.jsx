import { useState, useEffect } from 'react';
import { format, parse, isValid } from 'date-fns';

/**
 * Custom date input that displays DD/MM/YY format
 * but stores dates in ISO format (YYYY-MM-DD) internally
 */
const DateInput = ({ value, onChange, id, className, required, placeholder }) => {
  const [displayValue, setDisplayValue] = useState('');

  // Convert ISO date (YYYY-MM-DD) to DD/MM/YY for display
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return '';
    try {
      // Handle YYYY-MM-DD format
      const parts = isoDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const date = new Date(year, month - 1, day);
        if (isValid(date)) {
          return format(date, 'dd/MM/yy');
        }
      }
    } catch (error) {
      // If parsing fails
    }
    return '';
  };

  // Convert DD/MM/YY to ISO format (YYYY-MM-DD)
  const parseDateFromDisplay = (displayDate) => {
    if (!displayDate) return '';
    
    // Remove any non-digit characters except /
    const cleaned = displayDate.replace(/[^\d/]/g, '');
    
    // Try to parse DD/MM/YY format
    try {
      const parts = cleaned.split('/').filter(p => p);
      if (parts.length === 3) {
        let day = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10);
        let year = parseInt(parts[2], 10);
        
        // Convert 2-digit year to 4-digit
        if (year < 100) {
          year = 2000 + year;
        }
        
        // Validate and create date
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
          const date = new Date(year, month - 1, day);
          if (isValid(date) && date.getDate() === day && date.getMonth() === month - 1) {
            return format(date, 'yyyy-MM-dd');
          }
        }
      }
    } catch (error) {
      // Invalid date
    }
    return '';
  };

  // Initialize display value from ISO date
  useEffect(() => {
    if (value) {
      setDisplayValue(formatDateForDisplay(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    let inputValue = e.target.value;
    
    // Auto-format as user types (add slashes)
    inputValue = inputValue.replace(/[^\d]/g, ''); // Remove non-digits
    
    if (inputValue.length > 0) {
      // Add slashes automatically
      if (inputValue.length > 2) {
        inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
      }
      if (inputValue.length > 5) {
        inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5, 7);
      }
    }
    
    setDisplayValue(inputValue);
    
    // Try to parse and convert to ISO format if we have a complete date
    if (inputValue.length === 8) {
      const isoDate = parseDateFromDisplay(inputValue);
      if (isoDate) {
        onChange({ target: { value: isoDate } });
      }
    }
  };

  const handleBlur = () => {
    // Validate and format on blur
    const isoDate = parseDateFromDisplay(displayValue);
    if (isoDate) {
      setDisplayValue(formatDateForDisplay(isoDate));
      onChange({ target: { value: isoDate } });
    } else if (displayValue && !isoDate) {
      // Invalid date, show error or reset
      if (displayValue.length > 0) {
        alert('Please enter a valid date in DD/MM/YY format');
        setDisplayValue(formatDateForDisplay(value || ''));
      }
    }
  };

  return (
    <input
      type="text"
      id={id}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      placeholder={placeholder || "DD/MM/YY"}
      required={required}
      maxLength={8}
    />
  );
};

export default DateInput;

