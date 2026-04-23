export const metadata = {
  title: "Festa",
  description: "Festa vendor marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
