import { CheckCircle2, Circle } from 'lucide-react';

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

export function PasswordRequirement({ met, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
      <span className={met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>{text}</span>
    </div>
  );
}
