export default function AdminPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return <nav className="mt-5 flex items-center justify-end gap-3" aria-label="Pagination"><button type="button" className="rounded border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-40" disabled={page === 1} onClick={() => onChange(page - 1)}>Précédent</button><span className="text-sm text-[var(--gray)]">Page {page} / {totalPages}</span><button type="button" className="rounded border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-40" disabled={page === totalPages} onClick={() => onChange(page + 1)}>Suivant</button></nav>
}
