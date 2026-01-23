import { connect } from "react-redux";
import { nanoid } from "nanoid";
import MarkerComponent from "./MarkerComponent";
import { ChangeView } from "../Utils";

const LastPositionItemMarker = (props) => {
  const { machinePropsDetails, lastMarker } = props;

  if (!lastMarker) {
    return <></>
  }

  const headingValue = !lastMarker.course ? -45 : lastMarker.course - 45;

  return (<>
    <MarkerComponent
      key={nanoid(4)}
      positionData={lastMarker}
      heading={headingValue}
      machinePropsDetails={machinePropsDetails}
    />
    {!!lastMarker.position?.length === 2 &&
      lastMarker.position.every(x => x !== null && x !== undefined) &&
      <ChangeView
        zoom={14}
        center={lastMarker.position} />}
  </>
  );
}

const mapStateToProps = (state) => ({
  lastMarker: state.fleet.lastMarker
});

export default connect(mapStateToProps, undefined)(LastPositionItemMarker);
