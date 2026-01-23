import { Tooltip } from "react-leaflet";
import ContentDetails from "./ContentDetails";

const TooltipPopUp = (props) => {
  return (
    <>
      <Tooltip className="p-2">
        <ContentDetails {...props}  />
      </Tooltip>
    </>
  );
};

export default TooltipPopUp;
