import type { VercelRequest, VercelResponse } from '@vercel/node';

const TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const query = `
query($userName:String!, $from:DateTime!, $to:DateTime!) {
  user(login: $userName){
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Must be POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get last 6 months of contributions (will display as 7 rows)
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 6);

    const body = {
      query,
      variables: {
        userName: 'bbrockbrown',
        from: from.toISOString(),
        to: to.toISOString(),
      },
    };
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to get chart data: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: any) {
    console.error('Github API error:', err);
    return res.status(500).json({
      error: 'Failed to fetch GitHub graph',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
