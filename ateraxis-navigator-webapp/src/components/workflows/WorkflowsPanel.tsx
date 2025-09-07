'use client';

import { useState } from 'react';
import { WorkflowInstance, WorkflowEvent, WorkflowTemplate } from '@/types/workflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Clock, 
  AlertCircle, 
  PlayCircle, 
  StopCircle,
  MessageSquare,
  CheckCircle,
  XCircle,
  ChevronRight,
  Bot,
  Users,
  Search,
  BookOpen,
  AlertTriangle,
  Mail,
  Phone,
  Timer
} from 'lucide-react';
import workflowData from '@/mocks/workflows.json';
import { cn } from '@/lib/utils';

export function WorkflowsPanel() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowInstance | null>(null);
  const [activeTab, setActiveTab] = useState('active');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'waiting':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'podium_text':
        return <MessageSquare className="h-4 w-4" />;
      case 'email_received':
        return <Mail className="h-4 w-4" />;
      case 'voicemail':
        return <Phone className="h-4 w-4" />;
      case 'sla_breach':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTemplateIcon = (icon: string) => {
    const icons: any = {
      Bot: <Bot className="h-4 w-4" />,
      Users: <Users className="h-4 w-4" />,
      Search: <Search className="h-4 w-4" />,
      BookOpen: <BookOpen className="h-4 w-4" />,
      CheckCircle: <CheckCircle className="h-4 w-4" />,
      AlertTriangle: <AlertTriangle className="h-4 w-4" />
    };
    return icons[icon] || <Activity className="h-4 w-4" />;
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-4">
      {/* Left Panel - Workflow Lists */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Active Workflows
              <Badge variant="secondary" className="ml-2">
                {workflowData.activeWorkflows.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="events">
              Event Workflows
              <Badge variant="secondary" className="ml-2">
                {workflowData.eventWorkflows.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="available">
              Available Workflows
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="flex-1 mt-4">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-3 pr-4">
                {workflowData.activeWorkflows.map((workflow) => (
                  <Card 
                    key={workflow.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedWorkflow?.id === workflow.id && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedWorkflow(workflow as any)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {getStatusIcon(workflow.status)}
                            {workflow.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Started: {new Date(workflow.startedAt).toLocaleTimeString()}
                          </CardDescription>
                        </div>
                        <Badge variant={workflow.status === 'waiting' ? 'secondary' : 'default'}>
                          {workflow.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {workflow.waitingFor && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Timer className="h-3 w-3" />
                          {workflow.waitingFor.description}
                        </div>
                      )}
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Open Chat
                        </Button>
                        <Button size="sm" variant="outline">
                          <StopCircle className="h-3 w-3 mr-1" />
                          Stop
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="events" className="flex-1 mt-4">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-3 pr-4">
                {workflowData.eventWorkflows.map((event) => (
                  <Card key={event.id} className="cursor-pointer hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {getEventIcon(event.type)}
                            {event.source}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        {JSON.stringify(event.data).substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Suggested: {event.suggestedWorkflow}
                        </span>
                        <Button size="sm" variant="default">
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Start Workflow
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="available" className="flex-1 mt-4">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-3 pr-4">
                {workflowData.availableWorkflows.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {getTemplateIcon(template.icon)}
                            {template.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {template.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Est. {template.estimatedDuration}
                        </span>
                        <Button size="sm" variant="default">
                          <PlayCircle className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Workflow Details */}
      {selectedWorkflow && (
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(selectedWorkflow.status)}
              Workflow Details
            </CardTitle>
            <CardDescription>
              {selectedWorkflow.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-22rem)]">
              <div className="space-y-4">
                {/* Context */}
                {selectedWorkflow.context && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Context</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {Object.entries(selectedWorkflow.context).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workflow Steps - DAG Style */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Workflow Steps</h4>
                  <div className="space-y-2">
                    {selectedWorkflow.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border",
                          step.status === 'completed' && "bg-green-50 border-green-200 dark:bg-green-950/20",
                          step.status === 'active' && "bg-blue-50 border-blue-200 dark:bg-blue-950/20",
                          step.status === 'waiting' && "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20",
                          step.status === 'failed' && "bg-red-50 border-red-200 dark:bg-red-950/20",
                          step.status === 'pending' && "bg-gray-50 border-gray-200 dark:bg-gray-950/20"
                        )}
                      >
                        <div className="mt-0.5">
                          {step.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {step.status === 'active' && <Activity className="h-4 w-4 text-blue-500 animate-pulse" />}
                          {step.status === 'waiting' && <Clock className="h-4 w-4 text-yellow-500" />}
                          {step.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                          {step.status === 'pending' && <ChevronRight className="h-4 w-4 text-gray-400" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{step.name}</span>
                            {step.duration && (
                              <span className="text-xs text-muted-foreground">{step.duration}</span>
                            )}
                          </div>
                          {step.data && (
                            <div className="text-xs text-muted-foreground">
                              {typeof step.data === 'string' 
                                ? step.data 
                                : JSON.stringify(step.data, null, 2).substring(0, 100)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Waiting Status */}
                {selectedWorkflow.waitingFor && (
                  <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Waiting For</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedWorkflow.waitingFor.description}
                        </p>
                        {selectedWorkflow.waitingFor.deadline && (
                          <p className="text-xs text-muted-foreground">
                            Deadline: {new Date(selectedWorkflow.waitingFor.deadline).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}