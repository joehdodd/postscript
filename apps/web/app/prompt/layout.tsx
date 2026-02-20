export default function PromptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-ps-primary h-[calc(100vh-64px)] overflow-y-scroll">
      <div className="w-full flex justify-center md:p-4">
        {children}
      </div>
    </div>
  );
}
