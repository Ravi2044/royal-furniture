export function Loading({ label = 'Loading collection' }: { label?: string }) {
  return <div className="grid min-h-[40vh] place-items-center"><div className="text-center"><div className="mx-auto size-11 animate-spin rounded-full border-4 border-royal-green/15 border-t-royal-green" /><p className="mt-4 text-base text-royal-green/65">{label}…</p></div></div>
}
