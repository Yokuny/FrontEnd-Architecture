import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Mail, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type UnlockMethodFormValues, type UnlockOption, unlockMethodSchema } from '../@interface/unlock.types';

interface SelectMethodStepProps {
  options: UnlockOption[];
  onSubmit: (data: UnlockMethodFormValues) => void;
  onBack: () => void;
}

export function SelectMethodStep({ options, onSubmit, onBack }: SelectMethodStepProps) {
  const form = useForm<UnlockMethodFormValues>({
    resolver: zodResolver(unlockMethodSchema),
    defaultValues: {
      method: 'email',
    },
  });

  return (
    <Card className="border-0 shadow-2xl bg-black/40 backdrop-blur-xl text-white border-white/10 ring-1 ring-white/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-6 bg-gradient-to-br from-amber-500/20 to-amber-500/5 p-4 rounded-2xl w-fit backdrop-blur-sm border border-amber-500/20 shadow-lg shadow-amber-500/10">
          <Shield className="h-12 w-12 text-amber-500" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-white">Account Locked</CardTitle>
        <CardDescription className="text-zinc-400">
          Your account has been temporarily locked due to multiple failed login attempts. Choose a method to unlock your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300 font-medium">Unlock Method</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                      {options.map((option) => (
                        <Field
                          key={option.type}
                          orientation="horizontal"
                          className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                        >
                          <RadioGroupItem value={option.type} id={option.type} className="border-white/30 text-primary border-2" />
                          <Label htmlFor={option.type} className="flex-1 cursor-pointer font-normal">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                                {option.type === 'email' ? <Mail className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                              </div>
                              <div>
                                <p className="text-white font-medium">{option.type === 'email' ? 'Email' : 'SMS'}</p>
                                <p className="text-zinc-500 text-sm">{option.destination}</p>
                              </div>
                            </div>
                          </Label>
                        </Field>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 font-semibold text-base bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              Send Unlock Code
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </Form>

        <Button variant="ghost" size="sm" onClick={onBack} className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      </CardContent>
    </Card>
  );
}
