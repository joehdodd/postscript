export default function EntryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-[100vw] h-[100vh] flex items-baseline justify-center">
      {children}
    </div>
  );
}
