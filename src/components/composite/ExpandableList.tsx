import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableListProps {
  children: React.ReactNode[];
  showCount?: number;
  expandText?: string;
  collapseText?: string;
}

export default function ExpandableList({
  children,
  showCount = 3,
  expandText = 'Show more',
  collapseText = 'Show less',
}: ExpandableListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreItems = children.length > showCount;
  const visibleItems = isExpanded ? children : children.slice(0, showCount);

  return (
    <div className='space-y-2'>
      <AnimatePresence mode='popLayout'>
        {visibleItems.map((child, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMoreItems && (
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex items-center justify-center w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors group'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className='mr-1'>
            {isExpanded ? collapseText : `${expandText} (${children.length - showCount} more)`}
          </span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className='w-4 h-4 group-hover:translate-y-0.5 transition-transform' />
          </motion.div>
        </motion.button>
      )}
    </div>
  );
}
