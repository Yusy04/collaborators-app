import { useState, useEffect, useRef } from 'react';
import type { Campaign } from '../types';
import { CheckIcon, CloseIcon } from './Icons';

interface CampaignDetailModalProps {
  campaign: Campaign;
  isEnrolled: boolean;
  onClose: () => void;
  onEnroll: () => void;
}

export const CampaignDetailModal = ({
  campaign,
  isEnrolled,
  onClose,
  onEnroll,
}: CampaignDetailModalProps) => {
  const [agreed, setAgreed] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [productImageError, setProductImageError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      style={{ width: '100vw', height: '100vh', minHeight: '100vh' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-title"
        tabIndex={-1}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up motion-reduce:animate-none flex flex-col"
      >
        {/* Hero Image Header */}
        <div className="relative h-52 flex-shrink-0">
          {campaign.productImage && !productImageError ? (
            <img
              src={campaign.productImage}
              alt={campaign.productName || campaign.merchant}
              className="w-full h-full object-cover"
              onError={() => setProductImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-snoonu-red via-pink-500 to-snoonu-purple flex items-center justify-center">
              <span className="text-8xl opacity-50">📦</span>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5 text-white" />
          </button>
          
          {/* Merchant Logo */}
          <div className="absolute bottom-4 left-5 flex items-end gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden p-2">
              {!logoError ? (
                <img
                  src={campaign.logo}
                  alt={campaign.merchant}
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-3xl">🏪</span>
              )}
            </div>
            <div className="pb-1">
              <h2 id="campaign-title" className="text-xl font-bold text-white drop-shadow-lg">
                {campaign.merchant}
              </h2>
              <p className="text-sm text-white/80">{campaign.vertical} • {campaign.category}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Product Name */}
          {campaign.productName && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Featured Product</div>
              <div className="font-semibold text-gray-900">{campaign.productName}</div>
            </div>
          )}

          {/* Offer & Reward Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-snoonu-red/5 to-pink-50 rounded-xl p-4 border border-pink-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-snoonu-red/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎁</span>
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">Customer Offer</span>
              </div>
              <div className="font-bold text-snoonu-red">{campaign.discount}</div>
              <div className="text-xs text-gray-500 mt-1">{campaign.minOrder}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">Your Reward</span>
              </div>
              <div className="font-bold text-green-600">{campaign.reward}</div>
              <div className="text-xs text-green-600/80 mt-1">{campaign.rewardExample}</div>
            </div>
          </div>

          {/* Video Requirements */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎬</span>
              </div>
              <span className="font-semibold text-gray-900">Video Requirements</span>
            </div>
            <div className="text-sm text-purple-700 font-medium">{campaign.videoReq}</div>
          </div>

          {/* Requirements Checklist */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-snoonu-red rounded-full flex items-center justify-center text-white text-xs">✓</span>
              Content Guidelines
            </h4>
            <ul className="space-y-2.5">
              {campaign.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <div className="w-5 h-5 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-gray-400">{i + 1}</span>
                  </div>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Budget & Timeline */}
          <div className="flex gap-3">
            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-gray-500">Budget</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">{campaign.budget}</div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-500">Timeline</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">{campaign.timeline.replace('Campaign runs until ', '')}</div>
            </div>
          </div>
        </div>

        {/* Fixed Footer CTA */}
        <div className="flex-shrink-0 p-5 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
          {isEnrolled ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="font-semibold text-green-700">You're enrolled!</div>
              <div className="text-sm text-green-600">Go to Enrollments tab to upload your video</div>
            </div>
          ) : (
            <>
              <label className="flex items-center gap-3 text-sm cursor-pointer mb-4 p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 text-snoonu-red rounded border-gray-300 focus:ring-snoonu-red focus:ring-offset-0"
                />
                <span className="text-gray-600">I agree to the campaign terms and content guidelines</span>
              </label>
              <button
                onClick={() => {
                  onEnroll();
                  onClose();
                }}
                disabled={!agreed}
                className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:shadow-none"
                style={{ 
                  backgroundColor: agreed ? '#E31837' : '#e5e7eb',
                  color: agreed ? 'white' : '#9ca3af'
                }}
              >
                {agreed ? 'Enroll in Promotion' : 'Accept terms to continue'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
