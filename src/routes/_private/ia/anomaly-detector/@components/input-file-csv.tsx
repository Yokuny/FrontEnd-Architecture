import { Play, RefreshCw, StopCircle, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';

const csvStringToJson = (csvString: string) => {
  const lines = csvString.split('\n').filter((x) => x !== '' && x !== null);
  const headers = lines[0].split(',');
  const result: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const obj: any = {};
    const currentLine = lines[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      const value = currentLine[j]?.trim();
      const header = headers[j]?.trim();
      if (!header) continue;

      if (!Number.isNaN(value as any) && value !== '') {
        obj[header] = value.includes('.') ? parseFloat(value) : parseInt(value);
      } else if (Date.parse(value)) {
        obj[header] = new Date(value);
      } else {
        obj[header] = value;
      }
    }
    result.push(obj);
  }

  return result;
};

export function InputFileCsv({ onHandleData }: InputFileCsvProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIndex(null);
    setFile(null);
  }, []);

  useEffect(() => {
    if (index !== null) {
      const item = data[index];
      if (item) onHandleData(item);

      if (index >= data.length - 1) {
        stopMonitoring();
      }
    }
  }, [index, data, onHandleData, stopMonitoring]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    setIndex(0);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev !== null ? prev + 1 : null));
    }, 20000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setData(csvStringToJson(text));
        startMonitoring();
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div>
      {!isMonitoring ? (
        <div className="flex items-center gap-4 w-full justify-between">
          <input className="hidden" type="file" accept=".csv" ref={inputFileRef} onChange={handleFileChange} />

          {!file ? (
            <Button variant="outline" onClick={() => inputFileRef.current?.click()} className="gap-2">
              <Upload className="size-4" />
              {t('upload.csv')}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="size-8 text-destructive" onClick={() => setFile(null)}>
                <X className="size-4" />
              </Button>
              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
            </div>
          )}

          {file && (
            <Button variant="default" onClick={handleUpload} className="gap-2 animate-pulse shadow-lg shadow-primary/20">
              <Play className="size-4" />
              {t('start.monitoring')}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between w-full p-2 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <RefreshCw className="size-5 text-primary animate-spin" />
              <div className="absolute inset-0 bg-primary/20 blur-sm animate-pulse rounded-full" />
            </div>
            <ItemContent>
              <div className="flex items-center gap-2">
                <ItemTitle className="text-sm font-bold text-primary uppercase">{t('classify')}</ItemTitle>
                <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">
                  {(index || 0) + 1}/{data.length}
                </span>
              </div>
              <ItemDescription className="text-[10px] mt-0.5 uppercase tracking-wider">
                {t('last.date.acronym')}: {new Date().toLocaleTimeString()}
              </ItemDescription>
            </ItemContent>
          </div>

          <Button variant="destructive" onClick={stopMonitoring} className="gap-2">
            <StopCircle className="size-4" />
            {t('stop.monitoring')}
          </Button>
        </div>
      )}
    </div>
  );
}

interface InputFileCsvProps {
  onHandleData: (data: any) => void;
}
