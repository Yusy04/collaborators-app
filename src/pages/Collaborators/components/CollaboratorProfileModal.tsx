import { useEffect, useRef } from 'react';
import type { CollaboratorProfile } from '../types';
import { tierConfig } from '../constants';
import { CloseIcon } from './Icons';
import { TierBadge } from './TierBadge';

interface CollaboratorProfileModalProps {
  collaborator: CollaboratorProfile;
  isFollowing: boolean;
  onClose: () => void;
  onFollowToggle: () => void;
}

export const CollaboratorProfileModal = ({
  collaborator,
  isFollowing,
  onClose,
  onFollowToggle,
}: CollaboratorProfileModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    triggerRef.current = document.activeElement;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    modalRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
  }, [onClose]);

  const tier = tierConfig[collaborator.tier];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="collaborator-name"
        tabIndex={-1}
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl animate-slide-up motion-reduce:animate-none custom-scrollbar"
      >
        <div className="relative">
          {/* Header gradient */}
          <div className={`h-24 bg-gradient-to-r ${tier.gradient || 'from-gray-400 to-gray-600'} rounded-t-2xl`} />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-lg transition-colors"
            aria-label="Close profile"
          >
            <CloseIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Avatar */}
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg">
              <div className={`w-full h-full rounded-full bg-gradient-to-br ${tier.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center text-3xl text-white font-bold`}>
                {collaborator.handle.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-14 p-6">
          {/* Info */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 id="collaborator-name" className="text-xl font-bold text-gray-900">
                {collaborator.handle}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <TierBadge tier={collaborator.tier} />
                {collaborator.followers && <span className="text-sm text-gray-500">{collaborator.followers} followers</span>}
              </div>
            </div>
            <button
              onClick={onFollowToggle}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-snoonu-red text-white hover:bg-red-600'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900">{collaborator.approvedCount}</div>
              <div className="text-xs text-gray-500">Approvals</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900">{collaborator.totalEarnings}</div>
              <div className="text-xs text-gray-500">QAR Earned</div>
            </div>
            {collaborator.conversionRate && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-gray-900">{collaborator.conversionRate}%</div>
                <div className="text-xs text-gray-500">Conv. Rate</div>
              </div>
            )}
          </div>

          {/* Top Campaigns */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Top Campaigns</h4>
            <div className="space-y-2">
              {collaborator.topCampaigns.map((campaign, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{campaign.logo}</span>
                    <span className="text-sm text-gray-700">{campaign.merchant}</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">+{campaign.earnings} QAR</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
