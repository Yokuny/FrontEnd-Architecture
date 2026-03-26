import { Slot as SlotPrimitive } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '@/lib/utils/cn.util';

type TimelineContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
};

const TimelineContext = React.createContext<TimelineContextValue | undefined>(undefined);

const useTimeline = () => {
  const context = React.useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimeline must be used within a Timeline');
  }
  return context;
};

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

function Timeline({ defaultValue = 1, value, onValueChange, orientation = 'vertical', className, ...props }: TimelineProps) {
  const [activeStep, setInternalStep] = React.useState(defaultValue);

  const setActiveStep = React.useCallback(
    (step: number) => {
      if (value === undefined) {
        setInternalStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange],
  );

  const currentStep = value ?? activeStep;

  return (
    <TimelineContext.Provider value={{ activeStep: currentStep, setActiveStep }}>
      <div
        data-slot="timeline"
        className={cn('group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col', className)}
        data-orientation={orientation}
        {...props}
      />
    </TimelineContext.Provider>
  );
}

function TimelineContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="timeline-content" className={cn('text-md text-muted-foreground', className)} {...props} />;
}

interface TimelineDateProps extends React.HTMLAttributes<HTMLTimeElement> {
  asChild?: boolean;
}

function TimelineDate({ asChild = false, className, ...props }: TimelineDateProps) {
  const Comp = asChild ? SlotPrimitive : 'time';

  return (
    <Comp
      data-slot="timeline-date"
      className={cn('mb-1 block font-medium text-muted-foreground text-xs group-data-[orientation=vertical]/timeline:max-sm:h-4', className)}
      {...props}
    />
  );
}

function TimelineHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="timeline-header" className={cn(className)} {...props} />;
}

interface TimelineIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TimelineIndicator({ asChild = false, className, children, ...props }: TimelineIndicatorProps) {
  return (
    <div
      data-slot="timeline-indicator"
      className={cn(
        'absolute size-4 rounded-full border border-accent-foreground/20 group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=horizontal]/timeline:left-0 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=horizontal]/timeline:-translate-y-1/2',
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      {children}
    </div>
  );
}

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
}

function TimelineItem({ step, className, ...props }: TimelineItemProps) {
  const { activeStep } = useTimeline();

  return (
    <div
      data-slot="timeline-item"
      className={cn(
        'group/timeline-item relative flex flex-1 flex-col gap-0.5 group-data-[orientation=vertical]/timeline:ms-8 group-data-[orientation=horizontal]/timeline:mt-8 group-data-[orientation=horizontal]/timeline:not-last:pe-8 group-data-[orientation=vertical]/timeline:not-last:pb-12 has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-accent-foreground/20',
        className,
      )}
      data-completed={step <= activeStep || undefined}
      {...props}
    />
  );
}

function TimelineSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="timeline-separator"
      className={cn(
        'absolute self-start group-last/timeline-item:hidden group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-1rem)] group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.25rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=horizontal]/timeline:translate-x-4.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:translate-y-8',
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator };
