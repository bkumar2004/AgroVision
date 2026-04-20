import './globals.css';

export const metadata = {
  title: 'AgroVision — AI Crop Disease Detection',
  description: 'Upload a leaf image and instantly detect crop diseases with AI-powered analysis.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
