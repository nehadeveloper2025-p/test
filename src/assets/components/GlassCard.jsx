export default function GlassCard({ title, children, footer, className = "" }) {
  return (
    <section className={`glass p-6 ${className}`}>
      {title && (
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--ink)]">{title}</h3>
        </header>
      )}
      <div>{children}</div>
      {footer && <footer className="mt-4 pt-4 border-t border-white/60">{footer}</footer>}
    </section>
  );
}