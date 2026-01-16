import { useRef } from 'react';
import type { Tab } from '../types';

interface TabSwitcherProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'announcements', label: 'Announcements' },
  { id: 'enrollments', label: 'Enrollments' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

export const TabSwitcher = ({ activeTab, onTabChange }: TabSwitcherProps) => {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = index > 0 ? index - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = index < tabs.length - 1 ? index + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onTabChange(tabs[index].id);
        return;
      default:
        return;
    }
    
    tabsRef.current[newIndex]?.focus();
  };

  return (
    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto" role="tablist" aria-label="Collaborators sections">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => { tabsRef.current[index] = el; }}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onTabChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`relative flex items-center px-4 md:px-6 py-4 text-sm md:text-base font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-snoonu-red focus-visible:ring-offset-2 ${
            activeTab === tab.id
              ? 'text-snoonu-red'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="leading-tight">{tab.label}</span>
          {activeTab === tab.id && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-snoonu-red transition-all duration-200 ease-out motion-reduce:transition-none"
            />
          )}
        </button>
      ))}
    </div>
  );
};
