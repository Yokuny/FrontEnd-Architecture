import { useSearchParams } from "react-router-dom";

const REGIONS = [
  {
    value: "1",
    position: [-26.553534, -48.676442],
  },
  {
    value: "2",
    position: [-22.28245, -41.917841],
  },
  {
    value: "3",
    position: [-13.328642, -38.754993],
  },
  {
    value: "4",
    position: [-6.253149, -33.138896],
  },
  {
    value: "5",
    position: [-0.302686, -51.21687],
  },
];

export const REGION_DEFAULT = [-18.171396, -38.537897];
const ZOOM_DEFAULT = 5;

export const useQueryMap = () => {
  const [searchParams] = useSearchParams();

  let isRegionActive = false;

  const getCenter = () => {
    const centerParams = searchParams.get("center");
    if (centerParams) {
      const paramsCenterIsValid = centerParams.split(",");
      if (
        paramsCenterIsValid?.length === 2 &&
        !isNaN(parseFloat(paramsCenterIsValid[0])) &&
        !isNaN(parseFloat(paramsCenterIsValid[1]))
      ) {
        return [
          parseFloat(paramsCenterIsValid[0]),
          parseFloat(paramsCenterIsValid[1]),
        ];
      }
    }
    const region = searchParams.get("region");
    if (region) {
      const findPosition = REGIONS.find((x) => x.value == region)?.position;
      if (findPosition) {
        isRegionActive = true;
        return findPosition;
      }
    }

    return REGION_DEFAULT;
  };

  const center = getCenter();

  const zoomParams = parseInt(searchParams.get("zoom"));
  const zoom = zoomParams && !isNaN(zoomParams) ? zoomParams : ZOOM_DEFAULT;

  return { zoom, center, isRegionActive, REGION_DEFAULT };
};
