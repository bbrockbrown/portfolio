import { motion } from 'framer-motion';

interface TechBadgeProps {
  tech: string;
  index?: number;
  direction?: 'left' | 'right';
  isVisible?: boolean;
}

const techColors: Record<string, string> = {
  'typescript' : 'bg-gray-600/20 text-gray-400 border-blue-500/50',
  'tailwindcss': 'bg-gray-600/20 text-gray-400 border-cyan-500/50',
  'supabase'   : 'bg-gray-600/20 text-gray-400 border-green-500/50',
  'node'       : 'bg-gray-600/20 text-gray-400 border-green-600/50',
  'express'    : 'bg-gray-600/20 text-gray-400 border-gray-500/50',
  'react'      : 'bg-gray-600/20 text-gray-400 border-blue-400/50',
  'postgresql' : 'bg-gray-600/20 text-gray-400 border-blue-700/50',
  'python'     : 'bg-gray-600/20 text-gray-400 border-yellow-500/50',
  'flask'      : 'bg-gray-600/20 text-gray-400 border-red-500/50',
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
  const colorClass = techColors[tech] || 'bg-gray-600/20 text-gray-400 border-gray-500/50';
  
  // Calculate delay based on direction - wave effect
  const waveDelay = direction === 'left' 
    ? 0.5 + (index * 0.25)  // left-to-right wave with 0.5s initial delay
    : 0.5 + ((5 - index) * 0.25);  // right-to-left wave with 0.5s initial delay

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
        backdrop-blur-sm
        ${colorClass}
      `}
    >
      {tech}
    </motion.span>
  );
}