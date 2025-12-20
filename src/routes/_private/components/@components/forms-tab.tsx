import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export function FormsTab() {
  return (
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
  );
}
