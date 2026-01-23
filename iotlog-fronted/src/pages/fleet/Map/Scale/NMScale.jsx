import { createControlComponent } from '@react-leaflet/core';
import LeafletNmScale from './LeafletNmScale';

function createNmScaleControl(props) {
  const {
    nautical = true,
    imperial = false,
    metric = false,
    ...restProps
  } = props;
  return new LeafletNmScale({ nautical, imperial, metric, ...restProps });
}

export const NMScale = createControlComponent(
  createNmScaleControl
);
