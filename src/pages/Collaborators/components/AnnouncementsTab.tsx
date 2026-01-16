import { useState, useEffect } from 'react';
import type { Campaign, Enrollment } from '../types';
import { campaigns } from '../constants';
import { fetchCampaigns, testSupabaseConnection } from '../../../lib/supabaseQueries';
import { CampaignCard } from './CampaignCard';
import { CampaignDetailModal } from './CampaignDetailModal';

// Skeleton Card Component
const CampaignCardSkeleton = ({ index }: { index: number }) => (
  <div 
    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Image Skeleton */}
    <div className="relative h-44 bg-gradient-to-br from-gray-200 to-gray-100">
      {/* Logo Badge Skeleton */}
      <div className="absolute top-3 left-3">
        <div className="w-12 h-12 bg-white/80 rounded-xl shadow" />
      </div>
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skeleton-shimmer" />
    </div>
    
    {/* Content Skeleton */}
    <div className="p-4 space-y-3">
      {/* Title */}
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
        <div className="flex gap-2">
          <div className="h-4 bg-gray-100 rounded-full w-16" />
          <div className="h-4 bg-gray-100 rounded-full w-20" />
        </div>
      </div>
      
      {/* Offer boxes */}
      <div className="space-y-2">
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-gray-100 rounded-lg" />
      </div>
      
      {/* Footer */}
      <div className="flex gap-2 pt-1">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-4 bg-gray-100 rounded w-20" />
      </div>
    </div>
  </div>
);

interface AnnouncementsTabProps {
  enrollments: Enrollment[];
  onEnroll: (campaign: Campaign) => void;
}

export const AnnouncementsTab = ({ enrollments, onEnroll }: AnnouncementsTabProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignsList, setCampaignsList] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const loadCampaigns = async () => {
      console.log('[AnnouncementsTab] Component mounted - loading campaigns...');
      setIsLoading(true);
      setShowCards(false);
      
      try {
        // Test connection first
        const isConnected = await testSupabaseConnection();
        console.log('[AnnouncementsTab] Supabase connection test:', isConnected ? 'PASSED' : 'FAILED');
        
        // Fetch campaigns from Supabase
        const supabaseCampaigns = await fetchCampaigns();
        console.log('[AnnouncementsTab] Fetched campaigns:', supabaseCampaigns.length);
        
        if (supabaseCampaigns.length > 0) {
          console.log('[AnnouncementsTab] ✅ Using Supabase campaigns');
          setCampaignsList(supabaseCampaigns);
        } else {
          console.warn('[AnnouncementsTab] ⚠️ No campaigns found in database, using mock data');
          setCampaignsList(campaigns);
        }
      } catch (error) {
        console.error('[AnnouncementsTab] ❌ Failed to load campaigns from Supabase:', error);
        setCampaignsList(campaigns); // Fallback to mock data
      } finally {
        setIsLoading(false);
        // Small delay before showing cards for smooth transition
        setTimeout(() => setShowCards(true), 50);
      }
    };

    loadCampaigns();
  }, []);

  const isEnrolled = (campaignId: string) => 
    enrollments.some(e => e.campaign.id === campaignId);

  const handleEnroll = () => {
    if (selectedCampaign) {
      onEnroll(selectedCampaign);
    }
  };

  return (
    <div className="space-y-4">
      {/* Skeleton Loading State */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <CampaignCardSkeleton key={i} index={i} />
          ))}
        </div>
      )}

      {/* Actual Cards - all appear together with smooth animation */}
      {!isLoading && (
        <div 
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-500 ease-out ${
            showCards 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-3'
          }`}
        >
          {campaignsList.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              isEnrolled={isEnrolled(campaign.id)}
              onClick={() => setSelectedCampaign(campaign)}
            />
          ))}
        </div>
      )}

      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          isEnrolled={isEnrolled(selectedCampaign.id)}
          onClose={() => setSelectedCampaign(null)}
          onEnroll={handleEnroll}
        />
      )}

      {/* Shimmer animation styles */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};
