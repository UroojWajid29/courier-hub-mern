// Reusable skeleton components for loading states

export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />
      <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-700">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="py-3 px-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-gray-50 dark:border-gray-800">
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j} className="py-3 px-4">
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-56" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-36" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2 h-64 bg-gray-100 dark:bg-gray-800" />
        <div className="card p-5 h-64 bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  )
}
