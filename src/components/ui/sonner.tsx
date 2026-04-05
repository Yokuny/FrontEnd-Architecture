import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useIsMobile } from '../../hooks/use-mobile';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  const isMobile = useIsMobile();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      swipeDirections={['top', 'bottom'] as ToasterProps['swipeDirections']}
      position={isMobile ? 'top-center' : 'bottom-right'}
      toastOptions={{
        descriptionClassName: 'dark:!text-sky-blue ocean-blue:!text-sky-blue sunset:!text-orange-500 !font-bold !text-primary-blue',
      }}
      style={
        {
          '--normal-bg': 'var(--background)',
          '--normal-text': 'var(--foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
