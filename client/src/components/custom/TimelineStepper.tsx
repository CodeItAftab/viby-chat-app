import type { ComponentType } from "react";

interface Step {
  number: number;
  title?: string;
  icon: ComponentType<{ className?: string }>;
}

interface TimelineStepperProps {
  steps: Step[];
  currentStep: number;
}

export function TimelineStepper({ steps, currentStep }: TimelineStepperProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-center space-x-2 ">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-black text-white"
                    : isActive
                    ? "bg-black text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > step.number ? "bg-black" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* <div className="text-center">
        <p className="text-sm font-medium text-gray-900">
          {steps[currentStep - 1]?.title}
        </p>
        <p className="text-xs text-gray-500">
          Step {currentStep} of {steps.length}
        </p>
      </div> */}
    </div>
  );
}
