type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-2 rounded-lg border border-panel-border bg-panel-surface p-8">
      <h1 className="text-xl font-semibold text-panel-text">{title}</h1>
      <p className="max-w-xl text-sm text-panel-muted">{description}</p>
    </div>
  );
}
