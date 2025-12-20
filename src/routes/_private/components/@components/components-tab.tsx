import { AlertCircle, Bell, CheckCircle2, Clock, Heart, Mail, Share2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';

export function ComponentsTab() {
  return (
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
  );
}
