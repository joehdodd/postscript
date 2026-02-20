export default function EntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ps-primary">
      <div className="container mx-auto px-3 py-4 md:px-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
