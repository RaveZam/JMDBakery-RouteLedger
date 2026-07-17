export function LoadingSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-6">
      <div className="h-8 w-8 rounded-full border-2 border-muted border-t-emerald-600 animate-spin" />
    </div>
  );
}
