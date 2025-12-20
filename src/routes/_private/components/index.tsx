import { createFileRoute } from '@tanstack/react-router';
import { Activity, Bell, CheckCircle2, FileText, Filter, Layout, PieChart, Settings, Table, TrendingUp, Zap } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AdvancedFormsTab } from './@components/advanced-forms-tab';
import { AnalyticsTab } from './@components/analytics-tab';
import { ComponentsTab } from './@components/components-tab';
import { ContentTab } from './@components/content-tab';
import { DataTab } from './@components/data-tab';
import { FormsTab } from './@components/forms-tab';
import { OverviewTab } from './@components/overview-tab';
import { SelectsTab } from './@components/selects-tab';
import { TablesTab } from './@components/tables-tab';

export const Route = createFileRoute('/_private/components/')({
  component: App,
});

function App() {
  return (
    <div className="p-4 md:p-8 space-y-6 bg-background h-full border text-foreground">
      <div className=" mx-auto h-full border space-y-6">
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
        <Tabs defaultValue="overview" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-9 h-auto">
            <TabsTrigger value="overview">
              <Activity />
              Overview
            </TabsTrigger>
            <TabsTrigger value="components">
              <Settings />
              Components
            </TabsTrigger>
            <TabsTrigger value="selects">
              <Filter />
              Selects
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
            <OverviewTab />
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <ComponentsTab />
          </TabsContent>

          {/* Selects Tab */}
          <TabsContent value="selects" className="space-y-6">
            <SelectsTab />
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <FormsTab />
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <DataTab />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>

          {/* Tables Tab */}
          <TabsContent value="tables" className="space-y-6">
            <TablesTab />
          </TabsContent>

          {/* Advanced Forms Tab */}
          <TabsContent value="advanced-forms" className="space-y-6">
            <AdvancedFormsTab />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <ContentTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
