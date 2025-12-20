import { Activity, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Status, StatusIndicator, StatusLabel } from '@/components/kibo-ui/status';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardAction>
              <Badge variant="default">+12.5%</Badge>
            </CardAction>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">2,543</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="size-4" />
              <span>Active this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardAction>
              <Badge variant="default">+8.2%</Badge>
            </CardAction>
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">$45,231</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="size-4" />
              <span>Monthly recurring</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardAction>
              <Badge variant="destructive">-3.1%</Badge>
            </CardAction>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">1,234</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="size-4" />
              <span>Currently online</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardAction>
              <Badge variant="default">+5.4%</Badge>
            </CardAction>
            <CardTitle className="text-sm font-medium text-muted-foreground">Growth Rate</CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">23.5%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="size-4" />
              <span>Year over year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accordion Section */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Analytics</CardTitle>
          <CardDescription>Expand sections to view more information</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="users">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Users className="size-4" />
                  User Engagement Metrics
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-muted-foreground">User engagement has increased significantly with daily active users reaching new highs.</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">DAU: 1,234</Badge>
                    <Badge variant="outline">MAU: 2,543</Badge>
                    <Badge variant="outline">Retention: 85%</Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="revenue">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4" />
                  Revenue Breakdown
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-muted-foreground">Revenue streams are diversified across multiple channels with steady growth.</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">MRR: $45,231</Badge>
                    <Badge variant="secondary">ARR: $542,772</Badge>
                    <Badge variant="outline">ARPU: $17.80</Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="performance">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Activity className="size-4" />
                  System Performance
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-muted-foreground">All systems operational with excellent uptime and response times.</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Uptime: 99.9%</Badge>
                    <Badge variant="outline">Response: 180ms</Badge>
                    <Badge variant="outline">Errors: 0.01%</Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Real-time service health monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">API Service</p>
              <Status status="online">
                <StatusIndicator />
                <StatusLabel />
              </Status>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Database</p>
              <Status status="online">
                <StatusIndicator />
                <StatusLabel />
              </Status>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Cache Server</p>
              <Status status="degraded">
                <StatusIndicator />
                <StatusLabel />
              </Status>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">CDN</p>
              <Status status="maintenance">
                <StatusIndicator />
                <StatusLabel />
              </Status>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
