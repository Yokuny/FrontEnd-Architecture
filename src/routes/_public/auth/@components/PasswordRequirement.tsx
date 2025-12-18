import { CheckCircle2 } from "lucide-react";

interface PasswordRequirementProps {
  met: boolean;
  text: string;
}

export function PasswordRequirement({ met, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4 rounded-full border-2 border-zinc-600" />}
      <span className={met ? "text-green-400" : "text-zinc-500"}>{text}</span>
    </div>
  );
}
