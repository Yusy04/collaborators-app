import { useState } from 'react';
import type { Enrollment } from '../types';
import { statusConfig } from '../constants';

interface EnrollmentCardProps {
  enrollment: Enrollment;
  onClick: () => void;
}

// Default status info in case of undefined status
const defaultStatusInfo = { label: 'Unknown', bg: 'bg-gray-100', text: 'text-gray-700' };

// Status step mapping
const statusSteps: Record<string, { step: number; label: string }> = {
  enrolled: { step: 1, label: 'Upload Video' },
  uploaded: { step: 2, label: 'Submitted' },
  processing: { step: 3, label: 'Processing' },
  'under-review': { step: 4, label: 'Under Review' },
  approved: { step: 5, label: 'Live & Earning' },
  rejected: { step: 0, label: 'Needs Revision' },
};

export const EnrollmentCard = ({ enrollment, onClick }: EnrollmentCardProps) => {
  const [logoError, setLogoError] = useState(false);
  const statusInfo = statusConfig[enrollment.status] || defaultStatusInfo;
  const stepInfo = statusSteps[enrollment.status] || { step: 0, label: 'Unknown' };
  const isApproved = enrollment.status === 'approved';
  const isRejected = enrollment.status === 'rejected';
  const isProcessing = enrollment.status === 'processing' || enrollment.status === 'under-review';

  // Calculate conversion rate
  const conversionRate = enrollment.stats && enrollment.stats.clicks > 0 
    ? ((enrollment.stats.orders / enrollment.stats.clicks) * 100).toFixed(1) 
    : null;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 text-left group"
    >
      {/* Header with Logo and Status */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          {/* Merchant Logo */}
          <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 p-1.5 group-hover:border-gray-200 transition-colors">
            {!logoError && enrollment.campaign.logo.startsWith('http') ? (
              <img
                src={enrollment.campaign.logo}
                alt={enrollment.campaign.merchant}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-lg font-bold text-gray-400">
                {enrollment.campaign.merchant.charAt(0)}
              </span>
            )}
          </div>
          
          {/* Merchant Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 truncate group-hover:text-snoonu-red transition-colors">
                  {enrollment.campaign.merchant}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {enrollment.campaign.productName || enrollment.campaign.category}
                </p>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap flex-shrink-0 ${statusInfo.bg} ${statusInfo.text}`}>
                {statusInfo.label}
              </div>
            </div>
            
            {/* Reward Preview */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600">{enrollment.campaign.reward}</span>
              </div>
              <div className="w-px h-3 bg-gray-200" />
              <span className="text-xs text-gray-500">{enrollment.campaign.discount}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Section for Non-Approved/Non-Rejected */}
      {!isApproved && !isRejected && (
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-medium text-gray-600">Progress</span>
              <span className="text-xs font-semibold text-gray-900">Step {stepInfo.step} of 5</span>
            </div>
            
            {/* Step Indicators */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    step <= stepInfo.step
                      ? 'bg-gradient-to-r from-snoonu-red to-pink-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            {/* Status Message */}
            <div className="mt-2.5 flex items-center gap-2">
              {isProcessing && (
                <>
                  <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-[11px] text-gray-500">
                    {enrollment.status === 'processing' ? 'Video being processed' : 'Under review by our team'}
                  </span>
                </>
              )}
              {enrollment.status === 'enrolled' && (
                <>
                  <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span className="text-[11px] text-amber-600 font-medium">Waiting for your video upload</span>
                </>
              )}
              {enrollment.status === 'uploaded' && (
                <>
                  <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-[11px] text-green-600 font-medium">Video submitted successfully</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Rejected State */}
      {isRejected && (
        <div className="px-4 pb-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-700">Revision Required</p>
                <p className="text-[11px] text-red-600 mt-0.5">Tap to view feedback and re-upload</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Section for Approved Enrollments */}
      {enrollment.stats && isApproved && (
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white/70 rounded-lg py-2 px-1">
                <div className="text-sm font-bold text-gray-900">{enrollment.stats.clicks}</div>
                <div className="text-[10px] text-gray-500">Clicks</div>
              </div>
              <div className="bg-white/70 rounded-lg py-2 px-1">
                <div className="text-sm font-bold text-gray-900">{enrollment.stats.orders}</div>
                <div className="text-[10px] text-gray-500">Orders</div>
              </div>
              <div className="bg-white/70 rounded-lg py-2 px-1">
                <div className="text-sm font-bold text-blue-600">{conversionRate}%</div>
                <div className="text-[10px] text-gray-500">Conv.</div>
              </div>
              <div className="bg-white/70 rounded-lg py-2 px-1">
                <div className="text-sm font-bold text-green-600">{enrollment.stats.earnings}</div>
                <div className="text-[10px] text-gray-500">QAR</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">{enrollment.campaign.category}</span>
        <span className="text-xs font-medium text-snoonu-red group-hover:underline flex items-center gap-1">
          View Details
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </button>
  );
};
