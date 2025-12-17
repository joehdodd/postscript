type PromptContentProps = {
  content: string;
};

export default function PromptContent({ content }: PromptContentProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-ps-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-ps-primary">
          The Prompt
        </h2>
      </div>
      <div className="bg-ps-neutral-50 p-2 rounded-lg border-l-4 border-l-ps-primary-500">
        <p className="text-xl text-ps-primary italic leading-relaxed">
          &ldquo;{content}&rdquo;
        </p>
      </div>
    </div>
  );
}