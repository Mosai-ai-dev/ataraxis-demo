'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  BarChart,
  Brain,
  ThumbsUp,
  ThumbsDown,
  Send,
  Eye,
  PlayCircle
} from 'lucide-react';
import improvementData from '@/mocks/improvements.json';
import { cn } from '@/lib/utils';

export function ImprovementPanel() {
  const [selectedInteraction, setSelectedInteraction] = useState<any>(null);
  const [selectedDecision, setSelectedDecision] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<string>('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'escalated':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Tabs defaultValue="review" className="h-[calc(100vh-12rem)]">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="review">Interaction Review</TabsTrigger>
        <TabsTrigger value="audit">Decision Audit</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="learning">Learning Queue</TabsTrigger>
      </TabsList>

      {/* Interaction Review */}
      <TabsContent value="review" className="h-[calc(100vh-16rem)] mt-4">
        <div className="flex gap-4 h-full">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Recent Interactions</CardTitle>
              <CardDescription>Review past AI agent interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-24rem)]">
                <div className="space-y-3">
                  {improvementData.interactions.map((interaction: any) => (
                    <Card
                      key={interaction.id}
                      className={cn(
                        "cursor-pointer hover:shadow-md transition-all",
                        selectedInteraction?.id === interaction.id && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedInteraction(interaction)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(interaction.status)}
                              <span className="font-medium text-sm">
                                {interaction.employee?.name || 'Unknown'}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {interaction.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {interaction.user.name} • {interaction.duration}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(interaction.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">
                          {interaction.outcome}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {selectedInteraction && (
            <Card className="w-[400px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Interaction Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Decisions Made</h4>
                    <div className="space-y-2">
                      {selectedInteraction.decisions.map((decision: any) => (
                        <div key={decision.id} className="p-2 bg-muted rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{decision.description}</span>
                            <Badge
                              variant={decision.outcome === 'correct' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {decision.outcome}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              Confidence: {decision.confidence}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Replay Interaction
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Decision Audit */}
      <TabsContent value="audit" className="h-[calc(100vh-16rem)] mt-4">
        <div className="flex gap-4 h-full">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>AI Decisions</CardTitle>
              <CardDescription>Audit AI decisions for accuracy and compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-24rem)]">
                <div className="space-y-3">
                  {improvementData.aiDecisions.map((decision: any) => (
                    <Card
                      key={decision.id}
                      className={cn(
                        "cursor-pointer hover:shadow-md transition-all",
                        selectedDecision?.id === decision.id && "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedDecision(decision)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{decision.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {decision.type}
                              </Badge>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                getConfidenceColor(decision.confidence)
                              )}>
                                {decision.confidence}% confident
                              </span>
                              {decision.requiresReview && (
                                <Badge variant="destructive" className="text-xs">
                                  Review Required
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant={decision.outcome === 'correct' ? 'default' : 'destructive'}
                          >
                            {decision.outcome}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {selectedDecision && (
            <Card className="w-[400px]">
              <CardHeader>
                <CardTitle>Decision Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-28rem)]">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Reasoning</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedDecision.reasoning || 'Not available'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Systems Accessed</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedDecision.systemsAccessed?.map((system: string) => (
                          <Badge key={system} variant="secondary" className="text-xs">
                            {system}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Data Used</h4>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                        {JSON.stringify(selectedDecision.dataUsed, null, 2)}
                      </pre>
                    </div>

                    {selectedDecision.feedback && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <h4 className="text-sm font-medium mb-1">Feedback</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedDecision.feedback.comments}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {selectedDecision.feedback.rating}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            by {selectedDecision.feedback.submittedBy}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Feedback */}
      <TabsContent value="feedback" className="h-[calc(100vh-16rem)] mt-4">
        <div className="grid grid-cols-2 gap-4 h-full">
          <Card>
            <CardHeader>
              <CardTitle>Submit Feedback</CardTitle>
              <CardDescription>Help improve AI decision making</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Decision Rating</label>
                  <Select value={feedbackRating} onValueChange={setFeedbackRating}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="correct">Correct</SelectItem>
                      <SelectItem value="incorrect">Incorrect</SelectItem>
                      <SelectItem value="partial">Partially Correct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Comments</label>
                  <Textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Provide details about the decision..."
                    className="mt-1 h-32"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Suggested Correction</label>
                  <Textarea
                    placeholder="How should this have been handled?"
                    className="mt-1 h-20"
                  />
                </div>

                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback Impact</CardTitle>
              <CardDescription>Your feedback is making a difference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{improvementData.feedback.total}</p>
                    <p className="text-xs text-muted-foreground">Total Feedback</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {improvementData.feedback.implemented}
                    </p>
                    <p className="text-xs text-muted-foreground">Implemented</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {improvementData.feedback.pending}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">High Impact Changes</h4>
                  <div className="space-y-2">
                    {improvementData.feedback.impactful.map((item: any) => (
                      <div key={item.id} className="p-2 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{item.decision}</span>
                          <Badge variant="outline" className="text-xs">
                            Impact: {item.impact}/10
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.result}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Metrics */}
      <TabsContent value="metrics" className="h-[calc(100vh-16rem)] mt-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {improvementData.metrics.overview.map((metric: any) => (
            <Card key={metric.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {metric.value}{metric.unit === '%' && '%'}
                  </span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={cn(
                      "text-xs",
                      metric.trend === 'up' && metric.name.includes('Accuracy') ? 'text-green-500' : '',
                      metric.trend === 'down' && metric.name.includes('Response') ? 'text-green-500' : ''
                    )}>
                      {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.unit !== '%' && metric.unit}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Accuracy by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(improvementData.metrics.byCategory).map(([category, data]: any) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm capitalize">{category}</span>
                      <span className="text-sm font-medium">{data.accuracy}%</span>
                    </div>
                    <Progress value={data.accuracy} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {data.volume} interactions
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Avg: {data.avgTime}min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SLA Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {improvementData.metrics.slaCompliance.complianceRate}%
                  </p>
                  <p className="text-sm text-muted-foreground">Compliance Rate</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Met SLA</span>
                    <Badge variant="default">{improvementData.metrics.slaCompliance.met}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Warnings</span>
                    <Badge variant="secondary">{improvementData.metrics.slaCompliance.warning}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Breached</span>
                    <Badge variant="destructive">{improvementData.metrics.slaCompliance.breached}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Learning Queue */}
      <TabsContent value="learning" className="h-[calc(100vh-16rem)] mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Learning Queue Management</CardTitle>
            <CardDescription>Review and approve new patterns for AI learning</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <div className="space-y-3">
                {improvementData.learningQueue.map((item: any) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            <span className="font-medium text-sm">{item.content.problem}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.source}
                            </Badge>
                            {item.content.confidence && (
                              <span className="text-xs text-muted-foreground">
                                {item.content.confidence}% confidence
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            item.status === 'approved' ? 'default' :
                            item.status === 'rejected' ? 'destructive' :
                            item.status === 'modified' ? 'secondary' :
                            'outline'
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="p-2 bg-muted rounded">
                          <p className="text-sm">{item.content.solution}</p>
                        </div>
                        {item.comments && (
                          <p className="text-xs text-muted-foreground italic">
                            Review: {item.comments}
                          </p>
                        )}
                        {item.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Modify
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}