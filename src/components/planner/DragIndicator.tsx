import { useState, useEffect } from 'react';

interface DragIndicatorProps {
  active: boolean;
}

/**
 * A modern UI component that shows when drag is active
 * with a pulsing animation effect
 */
const DragIndicator = ({ active }: DragIndicatorProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 500); // fade out after 500ms
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out">
      <div 
        className={`
          bg-white rounded-full px-6 py-3 shadow-lg
          flex items-center justify-center space-x-2
          ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          border border-primary-200
        `}
      >
        <div className={`w-3 h-3 rounded-full bg-primary-500 ${active ? 'animate-pulse' : ''}`}></div>
        <span className="text-sm font-medium text-neutral-800">
          Drag to assign meal
        </span>
      </div>
    </div>
  );
};

export default DragIndicator;
