import { useEffect, useState } from 'react';

const AnimatedCounter = ({ value, duration = 1000, decimals = 2, prefix = '', suffix = '', className = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startValue = 0;
    const endValue = typeof value === 'number' ? value : parseFloat(value) || 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatValue = () => {
    if (decimals > 0) {
      return count.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    return Math.round(count).toLocaleString('en-IN');
  };

  return (
    <span className={className}>
      {prefix}{formatValue()}{suffix}
    </span>
  );
};

export default AnimatedCounter;

