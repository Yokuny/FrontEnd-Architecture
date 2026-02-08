import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type AIPromptData, aiPromptSchema } from './prompt.types';

export function usePromptForm(onSubmit: (data: AIPromptData) => void) {
  const form = useForm<AIPromptData>({
    resolver: zodResolver(aiPromptSchema),
    defaultValues: {
      question: '',
    },
  });

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    form.reset();
  });

  return {
    form,
    onSubmit: handleFormSubmit,
  };
}
