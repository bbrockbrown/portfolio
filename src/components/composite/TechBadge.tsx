import { motion } from 'framer-motion';

interface TechBadgeProps {
  tech: string;
  index?: number;
  direction?: 'left' | 'right';
  isVisible?: boolean;
}

const techColors: Record<string, string> = {
  'typescript' : 'border-[#3178c6]/75',
  'javascript' : 'border-[#f7df1e]/75',
  'tailwind': 'border-[#00baff]/75',
  'supabase'   : 'border-[#44cb8d]/75',
  'node'       : 'border-[#44883e]/75',
  'express'    : 'border-[#215732]/75',
  'react'      : 'border-[#00d8ff]/75',
  'postgresql' : 'border-[#3d668c]/75',
  'sqlite'     : 'border-[#f29111]/75',
  'python'     : 'gradient-wrapper',
  'flask'      : 'border-red-500/75',
  'bootstrap'  : 'border-[#8909fc]/75',
  /* 
    styled components / Radix / AG Grid / shadcn
  */
};

export default function TechBadge({ 
  tech, 
  index = 0, 
  direction = 'left',
  isVisible = false 
}: TechBadgeProps) {
  const colorClass = techColors[tech] || 'border-gray-500/75';
  
  // Calculate delay based on direction - wave effect
  const waveDelay = direction === 'left' 
    ? 0.5 + (index * 0.25)  // left-to-right wave with 0.5s initial delay
    : 0.5 + ((5 - index) * 0.25);  // right-to-left wave with 0.5s initial delay

  // Special case for Python gradient wrapper
  if (tech === 'python') {
    return (
      <motion.div
        initial={{ 
          opacity: 0, 
          scale: 0.3,
          y: 20,
          rotateZ: direction === 'left' ? -10 : 10
        }}
        animate={isVisible ? { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          rotateZ: 0
        } : {
          opacity: 0, 
          scale: 0.3,
          y: 20,
          rotateZ: direction === 'left' ? -10 : 10
        }}
        transition={{ 
          delay: isVisible ? waveDelay : 0,
          type: "spring",
          damping: 15,
          stiffness: 300,
          mass: 0.8
        }}
        className="bg-gradient-to-l opacity-75 from-[#ffde57] to-[#4584b6] p-[1px] rounded-full flex items-center"
      >
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm bg-[#252d39] text-gray-400">
          {tech}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.span
      initial={{ 
        opacity: 0, 
        scale: 0.3,
        y: 20,
        rotateZ: direction === 'left' ? -10 : 10
      }}
      animate={isVisible ? { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        rotateZ: 0
      } : {
        opacity: 0, 
        scale: 0.3,
        y: 20,
        rotateZ: direction === 'left' ? -10 : 10
      }}
      transition={{ 
        delay: isVisible ? waveDelay : 0,
        type: "spring",
        damping: 15,
        stiffness: 300,
        mass: 0.8
      }}
      className={`
        inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border
        backdrop-blur-sm bg-gray-600/20 text-gray-400
        ${colorClass}
      `}
    >
      {tech}
    </motion.span>
  );
}