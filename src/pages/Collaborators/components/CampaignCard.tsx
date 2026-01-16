import { useState } from 'react';
import type { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  isEnrolled: boolean;
  onClick: () => void;
}

export const CampaignCard = ({ campaign, isEnrolled, onClick }: CampaignCardProps) => {
  const [logoError, setLogoError] = useState(false);
  const [productImageError, setProductImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer group"
    >
      {/* Product Image Header */}
      <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
        {campaign.productImage && !productImageError ? (
          <img
            src={campaign.productImage}
            alt={campaign.productName || campaign.merchant}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setProductImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-snoonu-red/10 to-snoonu-purple/10">
            <span className="text-6xl opacity-50">📦</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Merchant Logo Badge */}
        <div className="absolute top-3 left-3">
          <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden p-1.5">
            {!logoError ? (
              <img
                src={campaign.logo}
                alt={campaign.merchant}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-2xl">🏪</span>
            )}
          </div>
        </div>
        
        {/* Enrolled Badge */}
        {isEnrolled && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Enrolled
            </span>
          </div>
        )}
        
        {/* Product Name on Image */}
        {campaign.productName && (
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-medium truncate drop-shadow-lg">
              {campaign.productName}
            </p>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        {/* Merchant Info */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-snoonu-red transition-colors">
            {campaign.merchant}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              {campaign.vertical}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{campaign.category}</span>
          </div>
        </div>
        
        {/* Offer & Reward */}
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-gradient-to-r from-snoonu-red/5 to-pink-50 rounded-lg px-3 py-2">
            <span className="text-xs text-gray-500">Customer Gets</span>
            <span className="font-semibold text-snoonu-red text-sm">{campaign.discount}</span>
          </div>
          <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-3 py-2">
            <span className="text-xs text-gray-500">You Earn</span>
            <span className="font-semibold text-green-600 text-sm">{campaign.reward}</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {campaign.budget}
          </div>
          <span className="text-xs text-snoonu-purple font-medium group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};
