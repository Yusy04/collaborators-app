import { useSearchParams } from 'react-router-dom';
import type { Enrollment } from '../types';

interface DemoControlsProps {
  enrollments: Enrollment[];
  onEnrollSample: () => void;
  onAdvanceEnrollment: (id: string) => void;
  onAdvanceToApproved: (id: string) => void;
  onRejectEnrollment: (id: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export const DemoControls = ({
  enrollments,
  onEnrollSample,
  onAdvanceEnrollment,
  onAdvanceToApproved,
  onRejectEnrollment,
  isExpanded,
  onToggle,
}: DemoControlsProps) => {
  const [searchParams] = useSearchParams();
  // Demo mode is now on by default (unless explicitly disabled with demo=0)
  const isDemoMode = searchParams.get('demo') !== '0';

  if (!isDemoMode) return null;

  const activeEnrollments = enrollments.filter(e => e.status !== 'approved' && e.status !== 'rejected');

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs">
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Demo Mode
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="p-4 space-y-4 animate-slide-up motion-reduce:animate-none">
            {/* Enroll Sample */}
            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Quick Actions</h4>
              <button
                onClick={onEnrollSample}
                style={{ backgroundColor: '#E31837' }}
                className="w-full px-3 py-2 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Enroll Sample Campaign
              </button>
            </div>

            {/* Enrollment Controls */}
            {activeEnrollments.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">
                  Active Enrollments ({activeEnrollments.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {activeEnrollments.map(enrollment => (
                    <div key={enrollment.id} className="bg-gray-800 rounded-lg p-2">
                      <div className="text-xs text-gray-300 truncate mb-2">
                        {enrollment.campaign.merchant} - {enrollment.status.replace('_', ' ')}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onAdvanceEnrollment(enrollment.id)}
                          className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Next Step
                        </button>
                        <button
                          onClick={() => onAdvanceToApproved(enrollment.id)}
                          className="flex-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectEnrollment(enrollment.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
