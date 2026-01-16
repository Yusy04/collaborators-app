# Snoonu Collaborators

A frontend prototype for Snoonu's Collaborator experience - enabling content creators to earn by promoting merchant campaigns.

## Overview

Snoonu Collaborators is a platform where influencers and content creators can:

- Browse and enroll in merchant promotional campaigns
- Upload video content for review
- Track their performance analytics
- Earn commissions on successful promotions
- Compete on leaderboards and earn tier rewards

## Features

### Announcements Tab
- Browse available campaigns from merchants
- View campaign details including rewards, requirements, and timelines
- Enroll in promotions with a single click

### Enrollments Tab
- Track enrollment status through the review pipeline
- Upload video content for campaign submissions
- View referral links for approved campaigns
- Monitor individual campaign performance

### Analytics Tab
- KPI cards showing clicks, orders, conversion rates, and earnings
- Interactive charts for performance over time
- Conversion tracking table
- Date range and campaign filters

### Gamification Tab
- Tier-based ranking system (Rookie, Bronze, Silver, Gold, Platinum)
- Top collaborators podium with Monthly/All Time toggle
- Merchant leaderboard
- Collaborator profiles with follow functionality
- Featured TikTok video examples

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/collaborators`

### Demo Mode

Demo mode is enabled by default, providing sample data for all features. This allows you to explore the full functionality without backend integration.

Demo controls are available in the bottom-right corner to:
- Enroll in sample campaigns
- Advance enrollment states through the review pipeline
- Test the complete user flow

## Project Structure

```
src/
  components/
    Header.tsx           # Global header with navigation
  pages/
    Collaborators/
      index.tsx          # Main collaborators page
      types.ts           # TypeScript interfaces
      constants.ts       # Mock data and configuration
      utils.ts           # Helper functions
      hooks/
        useCollaborators.ts  # Main state management hook
      components/
        AnnouncementsTab.tsx
        EnrollmentsTab.tsx
        AnalyticsTab.tsx
        LeaderboardTab.tsx
        DemoControls.tsx
        ...
```

## Enrollment State Machine

Enrollments progress through the following states:

1. **Enrolled** - Initial state after enrolling in a campaign
2. **Pending Upload** - Waiting for video submission
3. **Uploaded** - Video has been submitted
4. **Processing** - System is processing the submission
5. **Under Review** - Content is being reviewed by the team
6. **Approved** - Content approved, referral link active
7. **Rejected** - Content needs revision (optional path)

## Tier System

Collaborators earn tiers based on approved content:

| Tier | Required Approvals |
|------|-------------------|
| Rookie | 0 |
| Bronze | 3 |
| Silver | 10 |
| Gold | 25 |
| Platinum | 50 |

## Accessibility

- ARIA-compliant tab navigation
- Keyboard navigation support (Arrow keys, Home, End, Enter, Space)
- Modal focus management with ESC to close
- Respects prefers-reduced-motion preference

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## License

Proprietary - Snoonu
