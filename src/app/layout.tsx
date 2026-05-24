import type { Metadata } from 'next';
import { StyleProvider } from '@/contexts/StyleContext';
import { PhotoBoothProvider } from '@/contexts/PhotoBoothContext';
import './tailwind.css';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Photo Booth',
  description: 'Professional photo booth app with 2×6 and 4×6 print layouts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyleProvider>
          <PhotoBoothProvider>
            {children}
          </PhotoBoothProvider>
        </StyleProvider>
      </body>
    </html>
  );
}
