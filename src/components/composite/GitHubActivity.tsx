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

  const { weeks: rawWeeks, totalContributions } = contributionData;

  // Process weeks to create a perfect 7x25 rectangle
  const processWeeksForRectangle = (weeks: any[]) => {
    const targetWeeks = 25;
    let processedWeeks = [...weeks];

    // If we have more than 25 weeks, take the most recent 25
    if (processedWeeks.length > targetWeeks) {
      processedWeeks = processedWeeks.slice(-targetWeeks);
    }

    // If we have fewer than 25 weeks, pad with empty weeks at the beginning
    while (processedWeeks.length < targetWeeks) {
      const emptyWeek = {
        contributionDays: Array.from({ length: 7 }, (_, dayIndex) => ({
          contributionCount: 0,
          date: new Date(Date.now() - (processedWeeks.length + 1) * 7 * 24 * 60 * 60 * 1000 + dayIndex * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }))
      };
      processedWeeks.unshift(emptyWeek);
    }

    // Ensure each week has exactly 7 days
    processedWeeks = processedWeeks.map(week => ({
      ...week,
      contributionDays: week.contributionDays.slice(0, 7).concat(
        Array.from({ length: Math.max(0, 7 - week.contributionDays.length) }, () => ({
          contributionCount: 0,
          date: ''
        }))
      )
    }));

    return processedWeeks;
  };

  const weeks = processWeeksForRectangle(rawWeeks);

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

  // Find the last valid date (non-empty) in the last week
  const endDate = lastWeek?.contributionDays
    .slice()
    .reverse()
    .find(day => day.date && day.date !== '')?.date;

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
      className='flex flex-col justify-between backdrop-blur-sm bg-background/75 border border-border rounded-lg p-4 sm:p-6 hover:bg-background/85 transition-all duration-300'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div className='flex items-center justify-between mb-4 sm:mb-6'>
          <div className='flex items-center space-x-2 sm:space-x-3'>
            <Github className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
            <span className='text-white font-medium text-base sm:text-lg'>GitHub</span>
          </div>
          <div className='bg-gray-800/60 px-2 py-1 sm:px-3 rounded-full'>
            <span className='text-gray-300 text-xs sm:text-sm font-medium'>Last 3 months</span>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className='justify-self-center space-y-0.5 sm:space-y-1 mb-4 sm:mb-6 overflow-x-auto'>
          <div className='min-w-fit md:space-y-0.5'>
            {/* Create rows for each day of week */}
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div key={dayIndex} className='flex space-x-0.5 sm:space-x-1'>
                {weeks.map((week, weekIndex) => {
                  const day = week.contributionDays[dayIndex];
                  if (!day) return <div key={weekIndex} className='w-2.5 h-2.5 sm:w-3 sm:h-3' />;

                  return (
                    <Tooltip key={`${weekIndex}-${dayIndex}`}>
                      <TooltipTrigger asChild>
                        <motion.div
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-sm cursor-pointer ${getContributionLevel(
                            day.contributionCount
                          )}`}
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
                        <div className='text-center'>
                          <p className='font-medium text-sm'>
                            {day.contributionCount} contribution
                            {day.contributionCount !== 1 ? 's' : ''}
                          </p>
                          <p className='text-xs opacity-80'>
                            {new Date(day.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
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
        </div>
      </div>

      {/* Date Range */}
      <div className='flex justify-between items-center text-gray-400 text-xs sm:text-sm'>
        <span className='hidden sm:inline'>{startDate && formatDate(startDate)}</span>
        <span className='text-green-400 font-medium'>{totalContributions} contributions</span>
        <span>{endDate && formatDate(endDate)}</span>
      </div>
    </motion.div>
  );
}
