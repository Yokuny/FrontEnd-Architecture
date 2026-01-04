import L from 'leaflet';
import 'leaflet.polylinemeasure';
import 'leaflet.polylinemeasure/Leaflet.PolylineMeasure.css';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-leaflet';
import { useFleetManagerStore } from '../@hooks/use-fleet-manager-store';

interface MapMeasureProps {
  unit?: 'nm' | 'm';
}

export function MapMeasure(props: MapMeasureProps) {
  const map = useMap();
  const { t } = useTranslation();
  const { setPointsMeasureLine } = useFleetManagerStore();

  useEffect(() => {
    const instance = (L.control as any).polylineMeasure({
      position: 'topright',
      unit: props.unit === 'nm' ? 'nauticalmiles' : 'metres',
      showBearings: false,
      clearMeasurementsOnStop: true,
      showClearControl: false,
      showUnitControl: false,
      measureControlClasses: ['measure-control-hidden'],
      unitControlTitle: {
        text: t('change_unit'),
        metres: t('meters_kilometers'),
        landmiles: t('miles'),
        nauticalmiles: t('nautical_miles'),
      },
      tooltipTextFinish: t('tooltip_text_finish'),
      tooltipTextDelete: t('tooltip_text_delete'),
      tooltipTextMove: t('tooltip_text_move'),
      tooltipTextResume: t('tooltip_text_resume'),
      tooltipTextAdd: t('tooltip_text_add'),
    });

    instance.addTo(map);
    instance._toggleMeasure();

    const handleStart = (currentLine: any) => {
      setPointsMeasureLine([{ id: currentLine.id, points: currentLine.circleCoords || [] }]);
    };

    const handleChange = (currentLine: any) => {
      setPointsMeasureLine([{ id: currentLine.id, points: currentLine.circleCoords || [] }]);
    };

    const handleClear = () => {
      setPointsMeasureLine([]);
    };

    map.on('polylinemeasure:start', handleStart);
    map.on('polylinemeasure:change', handleChange);
    map.on('polylinemeasure:clear', handleClear);

    (window as any)._measureRef = instance;

    return () => {
      instance._clearAllMeasurements();
      instance.remove();
      map.off('polylinemeasure:start', handleStart);
      map.off('polylinemeasure:change', handleChange);
      map.off('polylinemeasure:clear', handleClear);
      (window as any)._measureRef = null;
    };
  }, [map, t, props.unit, setPointsMeasureLine]);

  useEffect(() => {
    const instance = (window as any)._measureRef;
    if (instance?.options && instance._map) {
      instance.options.unit = props.unit === 'nm' ? 'nauticalmiles' : 'metres';
      try {
        if (instance._changeUnit) instance._changeUnit();
      } catch {
        // Silently fail if DOM elements are not ready for unit change
      }
    }
  }, [props.unit]);

  return null;
}
