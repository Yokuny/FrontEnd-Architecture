import { createFileRoute } from '@tanstack/react-router';
import { Bell, CheckCircle2, Info, LogOut, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import DefaultEmptyData from '@/components/default-empty-data';
import DefaultFormLayout from '@/components/default-form-layout';
import DefaultLoading from '@/components/default-loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';

export const Route = createFileRoute('/_private/')({
  component: ShowcasePage,
});

function ShowcasePage() {
  const { t } = useTranslation();
  const { clearAuth, user } = useAuth();
  const [switchOn, setSwitchOn] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <Card>
      <CardHeader title={t('showcase.title')}>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">{user?.name || user?.email}</span>
          <Button variant="outline" size="sm" onClick={() => clearAuth()}>
            <LogOut className="mr-1 size-4" />
            {t('logout')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="forms">
          <TabsList>
            <TabsTrigger value="forms">{t('showcase.tab.forms')}</TabsTrigger>
            <TabsTrigger value="data">{t('showcase.tab.data')}</TabsTrigger>
            <TabsTrigger value="feedback">{t('showcase.tab.feedback')}</TabsTrigger>
            <TabsTrigger value="layout">{t('showcase.tab.layout')}</TabsTrigger>
          </TabsList>

          {/* ======== Tab: Formularios ======== */}
          <TabsContent value="forms">
            <DefaultFormLayout
              sections={[
                {
                  title: t('showcase.form.section.inputs'),
                  description: t('showcase.form.section.inputs.description'),
                  fields: [
                    <div key="input" className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label>{t('name')}</Label>
                        <Input placeholder={t('name.placeholder')} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>{t('email')}</Label>
                        <Input type="email" placeholder={t('email.placeholder')} />
                      </div>
                    </div>,
                    <div key="textarea" className="flex flex-col gap-2">
                      <Label>{t('showcase.form.message')}</Label>
                      <Textarea placeholder={t('showcase.form.message.placeholder')} />
                    </div>,
                  ],
                },
                {
                  title: t('showcase.form.section.toggles'),
                  description: t('showcase.form.section.toggles.description'),
                  fields: [
                    <div key="toggles" className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Checkbox id="check-demo" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
                        <Label htmlFor="check-demo">{t('showcase.form.accept.terms')}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="switch-demo" checked={switchOn} onCheckedChange={setSwitchOn} />
                        <Label htmlFor="switch-demo">{t('showcase.form.notifications')}</Label>
                      </div>
                    </div>,
                  ],
                },
                {
                  title: t('showcase.form.section.actions'),
                  fields: [
                    <div key="buttons" className="flex flex-wrap gap-2">
                      <Button>{t('showcase.form.save')}</Button>
                      <Button variant="secondary">{t('cancel')}</Button>
                      <Button variant="outline">{t('showcase.form.draft')}</Button>
                      <Button variant="destructive">{t('delete')}</Button>
                    </div>,
                  ],
                },
              ]}
            />
          </TabsContent>

          {/* ======== Tab: Dados ======== */}
          <TabsContent value="data" className="flex flex-col gap-6 p-6">
            <div className="flex flex-wrap gap-2">
              <Badge>{t('showcase.data.badge.default')}</Badge>
              <Badge variant="success">{t('showcase.data.badge.success')}</Badge>
              <Badge variant="warning">{t('showcase.data.badge.warning')}</Badge>
              <Badge variant="error">{t('showcase.data.badge.error')}</Badge>
              <Badge variant="info">{t('showcase.data.badge.info')}</Badge>
              <Badge variant="secondary">{t('showcase.data.badge.secondary')}</Badge>
            </div>

            <Separator />

            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>XY</AvatarFallback>
              </Avatar>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 font-semibold text-sm">{t('showcase.data.loading')}</h3>
              <DefaultLoading />
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 font-semibold text-sm">{t('showcase.data.empty')}</h3>
              <DefaultEmptyData />
            </div>
          </TabsContent>

          {/* ======== Tab: Feedback ======== */}
          <TabsContent value="feedback" className="flex flex-col gap-6 p-6">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => toast.success(t('showcase.feedback.toast.success'))}>
                <CheckCircle2 className="mr-1 size-4" />
                Toast Success
              </Button>
              <Button variant="outline" onClick={() => toast.error(t('showcase.feedback.toast.error'))}>
                <TriangleAlert className="mr-1 size-4" />
                Toast Error
              </Button>
              <Button variant="outline" onClick={() => toast.info(t('showcase.feedback.toast.info'))}>
                <Info className="mr-1 size-4" />
                Toast Info
              </Button>
              <Button variant="outline" onClick={() => toast.warning(t('showcase.feedback.toast.warning'))}>
                <Bell className="mr-1 size-4" />
                Toast Warning
              </Button>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">{t('showcase.feedback.alert.trigger')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('showcase.feedback.alert.title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('showcase.feedback.alert.description')}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction>{t('confirm')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">{t('showcase.feedback.dialog.trigger')}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('showcase.feedback.dialog.title')}</DialogTitle>
                  </DialogHeader>
                  <p className="text-muted-foreground text-sm">{t('showcase.feedback.dialog.content')}</p>
                </DialogContent>
              </Dialog>
            </div>

            <Separator />

            <TooltipProvider>
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      {t('showcase.feedback.tooltip.hover')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('showcase.feedback.tooltip.content')}</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            <Separator />

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Spinner />
                <Progress value={66} className="w-48" />
              </div>
            </div>
          </TabsContent>

          {/* ======== Tab: Layout ======== */}
          <TabsContent value="layout" className="flex flex-col gap-6 p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Item Title</ItemTitle>
                  <ItemDescription>Item description text</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Item Title 2</ItemTitle>
                  <ItemDescription>Another item description</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Item Title 3</ItemTitle>
                  <ItemDescription>Third item description</ItemDescription>
                </ItemContent>
              </Item>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-sm">Skeleton</h3>
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter layout="simple">
        <p className="text-muted-foreground text-xs">App_GPass - Component Showcase</p>
      </CardFooter>
    </Card>
  );
}
