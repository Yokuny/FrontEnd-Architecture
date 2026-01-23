import { connect } from "react-redux";
import DetailsStatusAsset from "./StatusAsset";
import DetailsTravel from "./DetailsTravel";

const FleetDetails = (props) => {

  if (props.filterPortActivity?.type) {
    return null
  }

  return (
    <>
      {!!props.machineDetailsSelected &&
        <DetailsStatusAsset
          key={`dsT${props.machineDetailsSelected?.machine?.id}`}
          item={props.machineDetailsSelected}
          isShowList={props.isShowList}
        />
      }
      {!!props.travelDetailsSelected &&
        <DetailsTravel
          key={`dVoy${props.travelDetailsSelected?.id}`}
          item={props.travelDetailsSelected}
          isShowList={props.isShowList}
        />}
    </>
  );
};

const mapStateToProps = (state) => ({
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  travelDetailsSelected: state.fleet.travelDetailsSelected,
  isShowList: state.fleet.isShowList,
  filterPortActivity: state.map.filterPortActivity,
});

export default connect(mapStateToProps, undefined)(FleetDetails);
