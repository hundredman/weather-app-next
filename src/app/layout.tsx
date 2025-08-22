// app/layout.tsx

import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { UnitsProvider } from '@/context/UnitsContext';
import { WeatherProvider } from '@/context/WeatherContext';
import './globals.css';

// Root layout component that wraps the application with providers
export const metadata: Metadata = {
  title: 'Weather App',
  description: 'A simple app to check the weather forecast.',
  viewport: 'width=device-width, initial-scale=1',
};

// This is the root layout component that wraps the entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UnitsProvider>
            <WeatherProvider>
              {children}
            </WeatherProvider>
          </UnitsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}