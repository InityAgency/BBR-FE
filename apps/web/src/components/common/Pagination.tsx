interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 3
}: PaginationProps) {
    const pages = [];
    
    // Always add first page
    pages.push(
        <button
            key={1}
            onClick={() => onPageChange(1)}
            className={`px-4 py-2 rounded-md ${
                currentPage === 1
                    ? 'bg-primary text-white'
                    : 'text-white hover:bg-primary/10'
            }`}
        >
            1
        </button>
    );

    // Calculate range of visible page numbers
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(2, endPage - maxVisiblePages + 2);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="px-2">...</span>);
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`px-4 py-2 rounded-md ${
                    currentPage === i
                        ? 'bg-primary text-white'
                        : 'text-white hover:bg-primary/10'
                }`}
            >
                {i}
            </button>
        );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="px-2">...</span>);
    }

    // Always add last page if there is more than one page
    if (totalPages > 1) {
        pages.push(
            <button
                key={totalPages}
                onClick={() => onPageChange(totalPages)}
                className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                        ? 'bg-primary text-white'
                        : 'text-white hover:bg-primary/10'
                }`}
            >
                {totalPages}
            </button>
        );
    }

    return (
        <div className="flex items-center justify-center gap-0 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                        ? 'disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'text-white hover:bg-primary/10'
                }`}
            >
                Previous
            </button>
            {pages}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                        ? 'disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'text-white hover:bg-primary/10'
                }`}
            >
                Next page
            </button>
        </div>
    );
} 