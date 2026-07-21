// DefaultErrorFallback.tsx
const DefaultErrorFallback = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-center p-6">
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Our team has been notified. Please try refreshing the page.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Reload
      </button>
    </div>
  );
};

export default DefaultErrorFallback;
