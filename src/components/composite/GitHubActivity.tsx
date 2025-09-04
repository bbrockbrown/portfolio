import { motion } from 'motion/react';
import { Github } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { GitHubApiResponse } from '@/types';

interface GitHubActivityProps {
  data: GitHubApiResponse | null;
}

export default function GitHubActivity({ data }: GitHubActivityProps) {
  if (!data) {
    return (
      <div className='flex items-center justify-center p-8 text-muted-foreground'>
        Loading GitHub activity...
      </div>
    );
  }

  // Handle the nested data structure from GitHub GraphQL API
  const contributionData = data.data?.user?.contributionsCollection?.contributionCalendar;
  
  if (!contributionData) {
    return (
      <div className='flex items-center justify-center p-8 text-muted-foreground'>
        No GitHub activity data available
      </div>
    );
  }

  const { weeks, totalContributions } = contributionData;

  // Get contribution level based on count (similar to GitHub's levels)
  const getContributionLevel = (count: number): string => {
    if (count === 0) return 'bg-gray-800/50';
    if (count <= 3) return 'bg-green-900/70';
    if (count <= 6) return 'bg-green-700/80';
    if (count <= 9) return 'bg-green-500/90';
    return 'bg-green-300';
  };

  // Get start and end dates for display
  const firstWeek = weeks[0];
  const lastWeek = weeks[weeks.length - 1];
  const startDate = firstWeek?.contributionDays[0]?.date;
  const endDate = lastWeek?.contributionDays[lastWeek.contributionDays.length - 1]?.date;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      className='border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-3'>
          <Github className='w-5 h-5 text-white' />
          <span className='text-white font-medium text-lg'>GitHub</span>
        </div>
        <div className='bg-gray-800/60 px-3 py-1 rounded-full'>
          <span className='text-gray-300 text-sm font-medium'>Last 3 months</span>
        </div>
      </div>

      {/* Contribution Graph */}
      <div className='space-y-1 mb-6'>
        {/* Create rows for each day of week */}
        {Array.from({ length: 7 }).map((_, dayIndex) => (
          <div key={dayIndex} className='flex space-x-1'>
            {weeks.map((week, weekIndex) => {
              const day = week.contributionDays[dayIndex];
              if (!day) return <div key={weekIndex} className='w-3 h-3' />;

              return (
                <Tooltip key={`${weekIndex}-${dayIndex}`}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={`w-3 h-3 rounded-sm cursor-pointer ${getContributionLevel(day.contributionCount)}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      transition={{
                        delay: (weekIndex * 7 + dayIndex) * 0.005,
                        duration: 0.2,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-medium">
                        {day.contributionCount} contribution{day.contributionCount !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs opacity-80">
                        {new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>

      {/* Date Range */}
      <div className='flex justify-between text-gray-400 text-sm'>
        <span>{startDate && formatDate(startDate)}</span>
        <span className='text-green-400 font-medium'>{totalContributions} contributions</span>
        <span>{endDate && formatDate(endDate)}</span>
      </div>
    </motion.div>
  );
}
