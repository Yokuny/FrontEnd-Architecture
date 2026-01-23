import { connect } from "react-redux";
import InfoVoyageFooter from "./InfoVoyageFooter";
import { setAssetVoyageSelected } from "../../../../actions";

const InfoVoyage = (props) => {
  return (
    <>
      {props.assetVoyageSelected && (
        <>
          <InfoVoyageFooter
            key={props.assetVoyageSelected?.machine?.id}
            machineDetails={props.assetVoyageSelected}
            onClose={() => props.setAssetVoyageSelected(undefined)}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  assetVoyageSelected: state.fleet.assetVoyageSelected,
});

const mapDispatchToProps = (dispatch) => ({
  setAssetVoyageSelected: (assetVoyageSelected) => {
    dispatch(setAssetVoyageSelected(assetVoyageSelected));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoVoyage);
