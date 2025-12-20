import { AlertCircle, CheckCircle2, Clock, Download, Filter, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function DataTab() {
  return (
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
              { title: 'New user registration', desc: 'John Doe joined the platform', time: '2 min ago', status: 'success' },
              { title: 'Payment processed', desc: 'Invoice #1234 paid successfully', time: '15 min ago', status: 'success' },
              { title: 'System alert', desc: 'High memory usage detected', time: '1 hour ago', status: 'warning' },
              { title: 'Feature deployed', desc: 'Dashboard v2.0 released', time: '3 hours ago', status: 'success' },
              { title: 'User feedback', desc: '5-star review received', time: '5 hours ago', status: 'success' },
              { title: 'Backup completed', desc: 'Daily backup finished', time: '8 hours ago', status: 'success' },
            ].map((activity, index) => (
              <div key={`${activity.title}-${activity.time}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${activity.status === 'success' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                    {activity.status === 'success' ? <CheckCircle2 className="size-4 text-green-500" /> : <AlertCircle className="size-4 text-yellow-500" />}
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
  );
}
