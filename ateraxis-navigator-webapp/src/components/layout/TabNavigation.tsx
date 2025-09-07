'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

type TabType = 'chat' | 'workflows' | 'admin';

function TabNavigationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['chat', 'workflows', 'admin'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`);
  };

  const tabs = [
    { id: 'chat', label: 'Agent Chat', icon: '💬' },
    { id: 'workflows', label: 'Active Workflows', icon: '⚙️' },
    { id: 'admin', label: 'Admin Panel', icon: '🛠️' },
  ] as const;

  return (
    <div className="w-full">
      {/* Tab List */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  const nextIndex = (currentIndex + 1) % tabs.length;
                  handleTabChange(tabs[nextIndex].id);
                } else if (e.key === 'ArrowLeft') {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);
                  const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                  handleTabChange(tabs[prevIndex].id);
                }
              }}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {activeTab === 'chat' && (
          <div id="chat-panel" role="tabpanel" data-testid="chat-panel">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Agent Chat</h2>
              <p className="text-gray-600 dark:text-gray-400">Chat interface will be implemented here</p>
            </div>
          </div>
        )}
        
        {activeTab === 'workflows' && (
          <div id="workflows-panel" role="tabpanel" data-testid="workflow-panel">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Active Workflows</h2>
              <p className="text-gray-600 dark:text-gray-400">Workflow management will be implemented here</p>
            </div>
          </div>
        )}
        
        {activeTab === 'admin' && (
          <div id="admin-panel" role="tabpanel" data-testid="admin-panel">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
              <p className="text-gray-600 dark:text-gray-400">Knowledge base and workflow suggestions will be implemented here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TabNavigation() {
  return (
    <Suspense fallback={
      <div className="w-full">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" role="tablist">
            <div className="py-2 px-1 border-b-2 border-blue-500">
              <span className="mr-2">💬</span>
              Agent Chat
            </div>
          </nav>
        </div>
      </div>
    }>
      <TabNavigationContent />
    </Suspense>
  );
}