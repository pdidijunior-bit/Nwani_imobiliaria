import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      onDismiss(latest.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-3.5 rounded-2xl shadow-xl border flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-md animate-in slide-in-from-top-3 fade-in duration-300 ${
            t.type === "success"
              ? "bg-emerald-950/90 border-emerald-700/80 text-emerald-200"
              : t.type === "error"
              ? "bg-rose-950/90 border-rose-700/80 text-rose-200"
              : "bg-stone-900/90 border-amber-500/50 text-stone-100"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {t.type === "error" && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {t.type === "info" && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
            <span className="text-xs font-medium leading-snug">{t.message}</span>
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
