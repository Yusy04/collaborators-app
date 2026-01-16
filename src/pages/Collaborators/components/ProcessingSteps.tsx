import type { EnrollmentStatus } from '../types';
import { statusConfig } from '../constants';
import { CheckIcon } from './Icons';

interface ProcessingStepsProps {
  currentStatus: EnrollmentStatus;
}

const steps: EnrollmentStatus[] = ['enrolled', 'uploaded', 'processing', 'under-review', 'approved'];

export const ProcessingSteps = ({ currentStatus }: ProcessingStepsProps) => {
  const currentIdx = steps.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between px-4">
      {steps.map((step, idx) => {
        const isComplete = idx < currentIdx || currentStatus === 'approved';
        const isCurrent = idx === currentIdx && currentStatus !== 'approved';
        const stepInfo = statusConfig[step];

        return (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className="relative flex items-center w-full">
              {/* Line before */}
              {idx > 0 && (
                <div
                  className="absolute left-0 right-1/2 h-0.5 -translate-x-1/2 transition-colors"
                  style={{ backgroundColor: isComplete || isCurrent ? '#E31837' : '#e5e7eb' }}
                />
              )}
              {/* Circle */}
              <div
                className={`relative z-10 mx-auto w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isComplete
                    ? 'bg-green-500 text-white animate-check-pop motion-reduce:animate-none'
                    : isCurrent
                    ? 'text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
                style={isCurrent ? { backgroundColor: '#E31837' } : undefined}
              >
                {isComplete ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>
              {/* Line after */}
              {idx < steps.length - 1 && (
                <div
                  className="absolute left-1/2 right-0 h-0.5 translate-x-1/2 transition-colors"
                  style={{ backgroundColor: isComplete ? '#E31837' : '#e5e7eb' }}
                />
              )}
            </div>
            <div className="mt-2 text-center">
              <div
                className={`text-xs font-medium ${
                  isComplete || isCurrent ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {stepInfo.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
