"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastTone = "error" | "info" | "success" | "validation";

type ToastInput = {
  message: string;
  tone?: ToastTone;
};

type ToastItem = ToastInput & {
  id: string;
};

type ToastContextValue = {
  showToast: (input: ToastInput) => void;
};

const TOAST_DURATION_MS = 4500;

const TOAST_STYLES: Record<
  ToastTone,
  {
    accentClassName: string;
    label: string;
  }
> = {
  error: {
    accentClassName: "border-red-200 bg-red-50 text-red-700",
    label: "Erro",
  },
  info: {
    accentClassName: "border-agromassa-border bg-white text-agromassa-forest",
    label: "Aviso",
  },
  success: {
    accentClassName: "border-agromassa-green bg-[#effbe9] text-agromassa-forest",
    label: "Sucesso",
  },
  validation: {
    accentClassName: "border-amber-200 bg-amber-50 text-amber-800",
    label: "Validacao",
  },
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastCounterRef = useRef(0);
  const timeoutsRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((toastId: string) => {
    const timeoutId = timeoutsRef.current.get(toastId);

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(toastId);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    );
  }, []);

  const showToast = useCallback(
    ({ message, tone = "info" }: ToastInput) => {
      const toastId = `toast-${Date.now()}-${toastCounterRef.current++}`;

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id: toastId,
          message,
          tone,
        },
      ]);

      const timeoutId = window.setTimeout(() => {
        dismissToast(toastId);
      }, TOAST_DURATION_MS);

      timeoutsRef.current.set(toastId, timeoutId);
    },
    [dismissToast],
  );

  useEffect(() => {
    const activeTimeouts = timeoutsRef.current;

    return () => {
      for (const timeoutId of activeTimeouts.values()) {
        window.clearTimeout(timeoutId);
      }

      activeTimeouts.clear();
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => {
          const styles = TOAST_STYLES[toast.tone ?? "info"];

          return (
            <div
              className={`pointer-events-auto rounded-lg border px-4 py-3 shadow-lg shadow-black/10 ${styles.accentClassName}`}
              key={toast.id}
              role="status"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-[0.08em]">
                    {styles.label}
                  </p>
                  <p className="mt-1 text-sm font-bold leading-5">
                    {toast.message}
                  </p>
                </div>
                <button
                  aria-label="Fechar notificacao"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-current/15 text-base font-black leading-none transition hover:bg-black/5"
                  onClick={() => dismissToast(toast.id)}
                  type="button"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
