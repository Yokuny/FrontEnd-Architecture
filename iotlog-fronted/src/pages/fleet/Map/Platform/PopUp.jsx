import { Popup as PopupL } from "react-leaflet";
import ContentDetails from "./ContentDetails";

const PopUp = (props) => {
  return (
    <>
      <PopupL className="p-2">
        <ContentDetails {...props}  />
      </PopupL>
    </>
  );
};

export default PopUp;
