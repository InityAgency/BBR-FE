import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    maxVisiblePages = 5
}: PaginationProps) {
    const [visiblePages, setVisiblePages] = useState(maxVisiblePages);
    
    // Set responsive visible pages based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) { // sm breakpoint in Tailwind
                setVisiblePages(1); // Only show current page on very small screens
            } else if (window.innerWidth < 768) { // md breakpoint
                setVisiblePages(3); // Show 3 pages on mobile
            } else {
                setVisiblePages(maxVisiblePages); // Default for larger screens
            }
        };
        
        // Set initial value
        handleResize();
        
        // Add resize listener
        window.addEventListener('resize', handleResize);
        
        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, [maxVisiblePages]);

    const pages = [];
    
    // Always add first page
    pages.push(
        <button
            key={1}
            onClick={() => onPageChange(1)}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md ${
                currentPage === 1
                    ? 'bg-primary text-white'
                    : 'text-white hover:bg-primary/10'
            }`}
        >
            1
        </button>
    );

    // Calculate range of visible page numbers
    let startPage = Math.max(2, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + visiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < visiblePages - 1) {
        startPage = Math.max(2, endPage - visiblePages + 2);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="px-3 sm:px-2">...</span>);
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md ${
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
        pages.push(<span key="ellipsis2" className="px-1 sm:px-2">...</span>);
    }

    // Always add last page if there is more than one page
    if (totalPages > 1) {
        pages.push(
            <button
                key={totalPages}
                onClick={() => onPageChange(totalPages)}
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md ${
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
        <div className="flex items-center justify-center gap-0 mt-8 flex-wrap">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md ${
                    currentPage === 1
                        ? 'disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'text-white hover:bg-primary/10'
                }`}
            >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">
                    <ArrowLeft />
                </span>
            </button>
            <div className="flex items-center overflow-x-auto gap-1">
                {pages}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md ${
                    currentPage === totalPages
                        ? 'disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'text-white hover:bg-primary/10'
                }`}
            >
                <span className="hidden sm:inline">Next page</span>
                <span className="sm:hidden">
                    <ArrowRight />  
                </span>
            </button>
        </div>
    );
}