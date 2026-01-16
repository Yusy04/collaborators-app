import { useState } from 'react';
import type { Campaign, Enrollment } from '../types';
import { campaigns } from '../constants';
import { CampaignCard } from './CampaignCard';
import { CampaignDetailModal } from './CampaignDetailModal';

interface AnnouncementsTabProps {
  enrollments: Enrollment[];
  onEnroll: (campaign: Campaign) => void;
}

export const AnnouncementsTab = ({ enrollments, onEnroll }: AnnouncementsTabProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const isEnrolled = (campaignId: string) => 
    enrollments.some(e => e.campaign.id === campaignId);

  const handleEnroll = () => {
    if (selectedCampaign) {
      onEnroll(selectedCampaign);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map(campaign => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            isEnrolled={isEnrolled(campaign.id)}
            onClick={() => setSelectedCampaign(campaign)}
          />
        ))}
      </div>

      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          isEnrolled={isEnrolled(selectedCampaign.id)}
          onClose={() => setSelectedCampaign(null)}
          onEnroll={handleEnroll}
        />
      )}
    </div>
  );
};
