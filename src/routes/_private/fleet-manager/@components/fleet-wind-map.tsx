import cryptoJs from 'crypto-js';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../@consts/fleet-manager';
import { useMapApiConfig } from '../@hooks/use-fleet-api';

const DECRYPT_KEY = 'zdY';

interface FleetWindMapProps {
  idEnterprise?: string;
}

export function FleetWindMap({ idEnterprise: _idEnterprise }: FleetWindMapProps) {
  const { data: config } = useMapApiConfig();
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!config?.token) return;

    // Load Leaflet and Windy scripts
    const loadScript = (url: string) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      return script;
    };

    const s1 = loadScript('https://unpkg.com/leaflet@1.4.0/dist/leaflet.js');
    const s2 = loadScript('https://api.windy.com/assets/map-forecast/libBoot.js');

    const initTimeout = setTimeout(() => {
      if ((window as any).windyInit && config.token) {
        try {
          const decoded = jwtDecode<{ payload: string; request: string }>(config.token);
          const key = cryptoJs.AES.decrypt(decoded.payload, `key@${decoded.request}${DECRYPT_KEY}`).toString(cryptoJs.enc.Utf8);

          (window as any).windyInit(
            {
              key,
              lat: DEFAULT_MAP_CENTER[0],
              lon: DEFAULT_MAP_CENTER[1],
              zoom: DEFAULT_MAP_ZOOM,
            },
            (windyAPI: any) => {
              const { map } = windyAPI;
              (window as any)._lmap = map;
              setIsReady(true);
            },
          );
        } catch (err) {
          console.error('Windy init failed', err);
        }
      }
    }, 5000); // 5s as per legacy

    return () => {
      if (document.body.contains(s1)) document.body.removeChild(s1);
      if (document.body.contains(s2)) document.body.removeChild(s2);
      clearTimeout(initTimeout);
      (window as any)._lmap = undefined;
      (window as any).windyInit = undefined;
      (window as any).windYInitialized = false;
    };
  }, [config]);

  return (
    <div className="size-full bg-slate-900 overflow-hidden relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        #windy #embed-zoom, #windy section, #windy #logo-wrapper, #windy .build-info {
          visibility: hidden !important;
        }
        #windy .leaflet-control-container {
          z-index: 10 !important;
        }
        #windy #mobile-ovr-select {
          z-index: 20 !important;
          top: 100px !important;
          right: 20px !important;
        }
        #windy #plugin-menu, #windy #layers-levels, #windy #bottom {
          z-index: 15 !important;
        }
        #windy .timecode {
          z-index: 20 !important;
        }
      `,
        }}
      />
      <div id="windy" ref={containerRef} className="size-full" />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              {config?.isConfigured === false ? 'Weather API Not Configured' : 'Initializing Weather Map...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
