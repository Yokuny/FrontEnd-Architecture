'use client';

import { ArrowUp, FileDigit, Paperclip, Square, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChatInput, ChatInputAction, ChatInputTextarea } from './chat';

export function PromptInputBasic({ input, onInputChange, isLoading, onSubmit }: PromptInputBasicProps) {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (input.trim() || files.length > 0) {
      onSubmit();
      setFiles([]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = '';
    }
  };

  return (
    <ChatInput className="w-full">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2" onClick={(e) => e.stopPropagation()}>
              <FileDigit className="size-4" />
              <span className="max-w-32 truncate">{file.name}</span>
              <button onClick={() => handleRemoveFile(index)} className="rounded-full p-1 hover:bg-secondary" type="button">
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ChatInputTextarea placeholder={`${t('search.placeholder')}...`} value={input} onChange={(e) => onInputChange(e.target.value)} />

      <div className="flex items-center justify-between gap-2 pt-2">
        <ChatInputAction tooltip={t('attach.files') || 'Attach files'}>
          <label htmlFor="file-upload" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl hover:bg-secondary-foreground/10">
            <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" ref={uploadInputRef} />
            <Paperclip className="size-5 text-primary" />
          </label>
        </ChatInputAction>

        <ChatInputAction tooltip={isLoading ? t('attach.files') : t('attach.files')}>
          <Button className="size-8 rounded-xl" onClick={handleSubmit} disabled={!input.trim() && files.length === 0 && !isLoading} type="button">
            {isLoading ? <Square className="size-3 fill-current" /> : <ArrowUp className="size-4" />}
          </Button>
        </ChatInputAction>
      </div>
    </ChatInput>
  );
}

interface PromptInputBasicProps {
  input: string;
  onInputChange: (value: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}
