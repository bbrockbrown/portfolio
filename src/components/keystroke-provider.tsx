import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface DailyLog {
  count: number;
  date: string;
}

interface KeyData {
  last_updated: string;
  recent_activity: DailyLog[];
  today_keystrokes: number;
  total_keystrokes: number;
}

interface KeystrokeContextType {
  keyData: KeyData | null;
  isLoading: boolean;
  error: string | null;
}

const KeystrokeContext = createContext<KeystrokeContextType | undefined>(undefined);

interface KeystrokeProviderProps {
  children: ReactNode;
}

export function KeystrokeProvider({ children }: KeystrokeProviderProps) {
  const [keyData, setKeyData] = useState<KeyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKeyData = async (retryCount: number): Promise<void> => {
      try {
        // console.log(`Fetching keystroke data (attempt ${retryCount + 1})...`);
        const response = await fetch(
          `${import.meta.env.VITE_KEYSTROKE_API_URL}/api/portfolio-stats`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: KeyData = await response.json();

        if (data.recent_activity.length === 0 && retryCount < 20) {
          // Database is still waking up, retry
          // console.log('Database still waking up, retrying in 2 seconds...');
          setTimeout(() => fetchKeyData(retryCount + 1), 2000);
        } else {
          // console.log('Keystroke data fetched successfully');
          setKeyData(data);
          setIsLoading(false);
          setError(null);
        }
      } catch (error: any) {
        // console.error('Failed to fetch keystroke data:', error);
        if (retryCount < 5) {
          // Retry on error up to 5 times
          setTimeout(() => fetchKeyData(retryCount + 1), 3000);
        } else {
          // Use dummy data after all retries failed
          const dummyData: KeyData = {
            last_updated: new Date().toISOString(),
            recent_activity: [
              { count: Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000, date: new Date().toISOString().split('T')[0] }
            ],
            today_keystrokes: Math.floor(Math.random() * (7000 - 5000 + 1)) + 5000,
            total_keystrokes: 1160186
          };
          setKeyData(dummyData);
          setIsLoading(false);
          setError(null);
        }
      }
    };

    // Start fetching immediately when provider mounts
    fetchKeyData(0);
  }, []);

  return (
    <KeystrokeContext.Provider value={{ keyData, isLoading, error }}>
      {children}
    </KeystrokeContext.Provider>
  );
}

export function useKeystroke() {
  const context = useContext(KeystrokeContext);
  if (context === undefined) {
    throw new Error('useKeystroke must be used within a KeystrokeProvider');
  }
  return context;
}