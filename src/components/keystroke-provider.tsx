import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

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

const API_URL = import.meta.env.VITE_KEYSTROKE_API_URL;
// The keystroke DB sleeps when idle, so an empty payload means "still waking".
const MAX_WAKE_RETRIES = 20;
const MAX_ERROR_RETRIES = 5;

interface KeystrokeProviderProps {
  children: ReactNode;
}

export function KeystrokeProvider({ children }: KeystrokeProviderProps) {
  const [keyData, setKeyData] = useState<KeyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Tracks pending retry timers and post-unmount state so a slow retry chain
    // can't outlive the provider.
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleRetry = (retryCount: number, delayMs: number) => {
      retryTimer = setTimeout(() => fetchKeyData(retryCount), delayMs);
    };

    const fetchKeyData = async (retryCount: number): Promise<void> => {
      if (cancelled) return;

      try {
        const response = await fetch(`${API_URL}/api/portfolio-stats`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: KeyData = await response.json();
        if (cancelled) return;

        if (!data.recent_activity?.length && retryCount < MAX_WAKE_RETRIES) {
          // Database is still waking up, retry
          scheduleRetry(retryCount + 1, 2000);
          return;
        }

        setKeyData(data);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        if (cancelled) return;

        if (retryCount < MAX_ERROR_RETRIES) {
          scheduleRetry(retryCount + 1, 3000);
          return;
        }

        // Out of retries. Surface the failure rather than inventing numbers --
        // these are presented to visitors as real stats.
        console.error('Failed to fetch keystroke data:', err);
        setKeyData(null);
        setIsLoading(false);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    // Start fetching immediately when provider mounts
    if (!API_URL) {
      // Without this the fetch would go to the literal string "undefined/api/..."
      console.error('VITE_KEYSTROKE_API_URL is not set; skipping keystroke fetch');
      setIsLoading(false);
      setError('Keystroke API is not configured');
      return;
    }

    fetchKeyData(0);

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
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