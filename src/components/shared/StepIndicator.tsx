"use client";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={step.label} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`h-px w-8 ${
                  isCompleted ? "bg-brand-500" : "bg-surface-700"
                }`}
              />
            )}
            <button
              type="button"
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isClickable}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isCurrent
                  ? "bg-brand-600 text-white"
                  : isCompleted
                    ? "cursor-pointer bg-brand-600/20 text-brand-400 hover:bg-brand-600/30"
                    : "bg-surface-800 text-surface-500"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  isCurrent
                    ? "bg-white/20"
                    : isCompleted
                      ? "bg-brand-500/30"
                      : "bg-surface-700"
                }`}
              >
                {isCompleted ? (
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              {step.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
