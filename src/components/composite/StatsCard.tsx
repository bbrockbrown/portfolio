import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  children: React.ReactNode;
  expandable?: boolean;
  defaultExpanded?: boolean;
  delay?: number;
}

export default function StatsCard({
  title,
  children,
  expandable = false,
  defaultExpanded = false,
  delay = 0,
}: StatsCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className='backdrop-blur-sm bg-background/75 border border-border rounded-lg p-6 hover:bg-background/85 transition-all duration-300'
    >
      <div className={`flex md:items-center md:justify-between mb-4 ${!expandable ? 'justify-start' : 'justify-between'}`}>
        <h3 className='text-lg font-semibold text-foreground md:text-start text-center'>{title}</h3>
        {expandable && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='p-1 hover:bg-accent rounded-md transition-colors'
          >
            {isExpanded ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
          </button>
        )}
      </div>

      <motion.div
        animate={{
          height: expandable && !isExpanded ? 'auto' : 'auto',
          opacity: 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='overflow-hidden'
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
