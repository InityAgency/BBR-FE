import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <h1 className="text-2xl font-bold text-red-500 mb-4">News article not found</h1>
      <p className="text-gray-600 mb-4">The requested news article could not be found.</p>
      <Link
        href="/newsroom"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Back to Newsroom
      </Link>
    </div>
  );
} 