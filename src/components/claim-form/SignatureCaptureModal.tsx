"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
};

export function SignatureCaptureModal({
  open,
  title = "Sign",
  onClose,
  onSave,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  if (!open) return null;

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Sign in the box with your finger, stylus, or mouse. Many people
            also sign the printed insurer form by hand.
          </p>
        </div>
        <div className="p-6">
          <canvas
            ref={canvasRef}
            width={400}
            height={180}
            className="w-full cursor-crosshair rounded-lg border-2 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
            onMouseDown={(e) => {
              setIsDrawing(true);
              const canvas = canvasRef.current;
              if (!canvas) return;
              const rect = canvas.getBoundingClientRect();
              setLastX(e.clientX - rect.left);
              setLastY(e.clientY - rect.top);
            }}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            onMouseMove={(e) => {
              if (!isDrawing || !canvasRef.current) return;
              const canvas = canvasRef.current;
              const ctx = canvas.getContext("2d");
              if (!ctx) return;
              const rect = canvas.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              ctx.strokeStyle = "#0f172a";
              ctx.lineWidth = 2;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(lastX, lastY);
              ctx.lineTo(x, y);
              ctx.stroke();
              setLastX(x);
              setLastY(y);
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const canvas = canvasRef.current;
              if (!canvas) return;
              const rect = canvas.getBoundingClientRect();
              setIsDrawing(true);
              setLastX(touch.clientX - rect.left);
              setLastY(touch.clientY - rect.top);
            }}
            onTouchEnd={() => setIsDrawing(false)}
            onTouchMove={(e) => {
              if (!isDrawing || !canvasRef.current) return;
              e.preventDefault();
              const touch = e.touches[0];
              const canvas = canvasRef.current;
              const ctx = canvas.getContext("2d");
              if (!ctx) return;
              const rect = canvas.getBoundingClientRect();
              const x = touch.clientX - rect.left;
              const y = touch.clientY - rect.top;
              ctx.strokeStyle = "#0f172a";
              ctx.lineWidth = 2;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(lastX, lastY);
              ctx.lineTo(x, y);
              ctx.stroke();
              setLastX(x);
              setLastY(y);
            }}
          />
          <div className="mt-4 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={clear}>
              Clear
            </Button>
            <Button type="button" className="flex-1" onClick={save}>
              Save signature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
