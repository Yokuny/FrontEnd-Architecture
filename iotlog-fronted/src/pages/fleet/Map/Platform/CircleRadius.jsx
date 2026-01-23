import { Circle } from "react-leaflet";

const CircleRadius = ({ data, color }) => {
  return (
    <>
      <Circle
        center={data.position}
        color={color}
        radius={data.radius}
      />
    </>
  );
};

export default CircleRadius;
