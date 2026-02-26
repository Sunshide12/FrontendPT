import { useEffect } from "react";

const toastStyles = {
  success: "bg-green-50 border border-green-200 text-green-700",
  warning: "bg-yellow-50 border border-yellow-200 text-yellow-700",
  error: "bg-red-50 border border-red-200 text-red-500",
};

const icons = {
  success: "✓",
  warning: "⚠",
  error: "✕",
};

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-md text-sm font-medium transition-all ${toastStyles[type]}`}>
      <span className="text-base">{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 text-base leading-none">
        ×
      </button>
    </div>
  );
}

export default Toast;
