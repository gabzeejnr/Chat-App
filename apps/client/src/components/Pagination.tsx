import type { PaginationProps } from "../types";


export default  function Pagination({ page, totalPages, hasNextPage, hasPreviousPage, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <nav aria-label="Pagination" className="mt-auto flex items-center justify-between gap-4 py-3">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
                <button type="button" onClick={() => onPageChange(page - 1)} disabled={!hasPreviousPage}
                    aria-label="Previous page"
                    className="rounded-sm border-2 border-primary bg-primary px-3 py-2 text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    &lt;
                </button>
                <button type="button" onClick={() => onPageChange(page + 1)} disabled={!hasNextPage}
                    aria-label="Next page"
                    className="rounded-sm border-2 border-primary bg-primary px-3 py-2 text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                    &gt;
                </button>
            </div>
        </nav>
    )
}
