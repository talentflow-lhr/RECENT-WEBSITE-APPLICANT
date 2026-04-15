import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  key: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                  step.id === currentStep
                    ? 'bg-[#17960b] text-white shadow-lg scale-110'
                    : step.id < currentStep
                    ? 'bg-[#17960b] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                ) : (
                  <span className="text-xs sm:text-sm">{step.id}</span>
                )}
              </div>
              <span
                className={`mt-1 sm:mt-2 text-[10px] sm:text-xs md:text-sm text-center max-w-[60px] sm:max-w-[80px] md:max-w-[100px] leading-tight ${
                  step.id === currentStep
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 sm:mx-2 transition-all ${
                  step.id < currentStep ? 'bg-[#17960b]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}