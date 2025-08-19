import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { UnitsProvider } from '@/context/UnitsContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'A simple app to check the weather forecast.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UnitsProvider>{children}</UnitsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}