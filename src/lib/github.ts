import type { GitHubApiResponse } from '@/types';

export const getContributionData = async (): Promise<GitHubApiResponse | null> => {
  try {
    const response = await fetch('/api/contribution-graph', {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GitHubApiResponse = await response.json();
    return data;
  } catch (err: any) {
    console.error('Failed to get top tracks', err);
    return null;
  }
};
