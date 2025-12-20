import { useNavigate } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function SuccessStep() {
  const navigate = useNavigate();

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardContent className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 p-6 rounded-full backdrop-blur-sm border border-green-500/20 shadow-lg shadow-green-500/10">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">
            <FormattedMessage id="email.recover.send" defaultMessage="Check Your Email!" />
          </h2>
          <p className="text-zinc-400">
            <FormattedMessage id="email.send" defaultMessage="We've sent you a password reset code" />
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: '/auth' })}
          className="w-full h-12 font-semibold text-base bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          size="lg"
        >
          <FormattedMessage id="back.login" defaultMessage="Back to Login" />
        </Button>
      </CardContent>
    </Card>
  );
}
