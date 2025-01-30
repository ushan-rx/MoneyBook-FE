import NavigationBar from '@/components/NavigationBar';

export default function WithNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
      <NavigationBar />
    </div>
  );
}
