function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.last_page <= 1) return null;

  return (
    <div className="flex items-center gap-3 mt-4 text-sm text-gray-500">
      <button onClick={() => onPageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="px-3 py-1 rounded disabled:opacity-40 hover:text-gray-800 transition-colors">
        Anterior
      </button>
      <span className="font-medium text-gray-700">
        Página {pagination.current_page} de {pagination.last_page}
      </span>
      <button
        onClick={() => onPageChange(pagination.current_page + 1)}
        disabled={pagination.current_page === pagination.last_page}
        className="px-3 py-1 rounded font-semibold text-primary disabled:opacity-40 hover:text-primary-hover transition-colors">
        Siguiente
      </button>
    </div>
  );
}

export default Pagination;
