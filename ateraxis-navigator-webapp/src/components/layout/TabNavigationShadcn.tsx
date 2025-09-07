'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Activity, Brain } from 'lucide-react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { WorkflowsPanel } from '@/components/workflows/WorkflowsPanel';
import { ImprovementPanel } from '@/components/improvement/ImprovementPanel';

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

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
    router.push(`?tab=${value}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Agent Chat
        </TabsTrigger>
        <TabsTrigger value="workflows" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Workflows
        </TabsTrigger>
        <TabsTrigger value="admin" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Agent Improvement
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="mt-6">
        <ChatPanel />
      </TabsContent>
      
      <TabsContent value="workflows" className="mt-6">
        <WorkflowsPanel />
      </TabsContent>
      
      <TabsContent value="admin" className="mt-6">
        <ImprovementPanel />
      </TabsContent>
    </Tabs>
  );
}

export function TabNavigationShadcn() {
  return (
    <Suspense fallback={
      <div className="w-full">
        <div className="h-10 bg-muted rounded-lg animate-pulse" />
      </div>
    }>
      <TabNavigationContent />
    </Suspense>
  );
}