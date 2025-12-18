import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileText,
  Filter,
  Heart,
  Layout,
  Mail,
  MapPin,
  Phone,
  PieChart,
  Settings,
  Share2,
  Star,
  Table,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import AccordionTabs1 from "@/components/accordion-tabs-1";
import CardStandard4 from "@/components/card-standard-4";
import EmptyStandard5 from "@/components/empty-standard-5";
import FieldLayouts4 from "@/components/field-layouts-4";
import FieldLayouts5 from "@/components/field-layouts-5";
import FieldSelects5 from "@/components/field-selects-5";
import FieldToggles3 from "@/components/field-toggles-3";
import FormAdvanced7 from "@/components/form-advanced-7";
import FormPatterns3 from "@/components/form-patterns-3";
import { Status, StatusIndicator, StatusLabel } from "@/components/kibo-ui/status";
import { LanguageSwitcher } from "@/components/language-switcher";
import Stats01 from "@/components/stats-01";
import Stats03 from "@/components/stats-03";
import Stats09 from "@/components/stats-09";
import Table05 from "@/components/table-05";
import TableStandard3 from "@/components/table-standard-3";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/_private/components/")({
  component: App,
});

function App() {
  return (
    <div className="p-4 md:p-8 space-y-6 bg-background min-h-screen text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section with Activity Icon */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Activity className="size-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Component Showcase</h1>
              <p className="text-muted-foreground text-sm md:text-base">Exploring our comprehensive design system</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bell className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button>
              <Zap className="size-4" />
              Quick Action
            </Button>
          </div>
        </div>

        <Separator />

        {/* Main Tabs Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
            <TabsTrigger value="overview">
              <Activity />
              Overview
            </TabsTrigger>
            <TabsTrigger value="components">
              <Settings />
              Components
            </TabsTrigger>
            <TabsTrigger value="forms">
              <CheckCircle2 />
              Forms
            </TabsTrigger>
            <TabsTrigger value="data">
              <TrendingUp />
              Data
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <PieChart />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="tables">
              <Table />
              Tables
            </TabsTrigger>
            <TabsTrigger value="advanced-forms">
              <FileText />
              Advanced Forms
            </TabsTrigger>
            <TabsTrigger value="content">
              <Layout />
              Content
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
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
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Buttons Showcase */}
              <Card>
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>All available button styles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    <Button size="icon">
                      <Star className="size-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Heart className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Share2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Badges Showcase */}
              <Card>
                <CardHeader>
                  <CardTitle>Badge Components</CardTitle>
                  <CardDescription>Status and label indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    <Badge>
                      <CheckCircle2 className="size-3" /> Success
                    </Badge>
                    <Badge variant="destructive">
                      <AlertCircle className="size-3" /> Error
                    </Badge>
                    <Badge variant="secondary">
                      <Clock className="size-3" /> Pending
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Toggle Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Toggle Components</CardTitle>
                  <CardDescription>Interactive toggle buttons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Toggle>
                      <Star className="size-4" />
                    </Toggle>
                    <Toggle>
                      <Heart className="size-4" />
                    </Toggle>
                    <Toggle>
                      <Bell className="size-4" />
                    </Toggle>
                    <Toggle>
                      <Mail className="size-4" />
                    </Toggle>
                  </div>
                </CardContent>
              </Card>

              {/* Loading States */}
              <Card>
                <CardHeader>
                  <CardTitle>Loading Skeletons</CardTitle>
                  <CardDescription>Placeholder loading states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>Input fields and form controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@example.com" className="pl-9" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="pl-9" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input id="location" placeholder="City, Country" className="pl-9" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Preferences</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="newsletter" />
                      <label htmlFor="newsletter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Subscribe to newsletter
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifications" />
                      <label htmlFor="notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Enable notifications
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="updates" />
                      <label htmlFor="updates" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Receive product updates
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t flex justify-between">
                <Button variant="outline">Reset</Button>
                <Button>Submit Form</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Latest updates and events</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Filter className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {[
                      { title: "New user registration", desc: "John Doe joined the platform", time: "2 min ago", status: "success" },
                      { title: "Payment processed", desc: "Invoice #1234 paid successfully", time: "15 min ago", status: "success" },
                      { title: "System alert", desc: "High memory usage detected", time: "1 hour ago", status: "warning" },
                      { title: "Feature deployed", desc: "Dashboard v2.0 released", time: "3 hours ago", status: "success" },
                      { title: "User feedback", desc: "5-star review received", time: "5 hours ago", status: "success" },
                      { title: "Backup completed", desc: "Daily backup finished", time: "8 hours ago", status: "success" },
                    ].map((activity, index) => (
                      <div key={`${activity.title}-${activity.time}`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${activity.status === "success" ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                            {activity.status === "success" ? <CheckCircle2 className="size-4 text-green-500" /> : <AlertCircle className="size-4 text-yellow-500" />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{activity.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="size-3" />
                                {activity.time}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.desc}</p>
                          </div>
                        </div>
                        {index < 5 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="ghost" className="w-full">
                  <Upload className="size-4" />
                  Load More
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Stats01 />
            <Stats03 />
            <Stats09 />
          </TabsContent>

          {/* Tables Tab */}
          <TabsContent value="tables" className="space-y-6">
            <Table05 />
            <TableStandard3 />
          </TabsContent>

          {/* Advanced Forms Tab */}
          <TabsContent value="advanced-forms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormAdvanced7 />
                <FormPatterns3 />
              </div>
              <div className="space-y-6">
                <FieldLayouts4 />
                <FieldLayouts5 />
                <FieldSelects5 />
                <FieldToggles3 />
              </div>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <AccordionTabs1 />
                <EmptyStandard5 />
              </div>
              <div className="space-y-6">
                <CardStandard4 />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
