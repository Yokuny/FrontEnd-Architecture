import { connect } from "react-redux";
import { nanoid } from "nanoid";
import { MODELS } from "../../../../register/platform/Constants";
import FixedPlatform from "./FixedPlatform";
import MovePlatform from "./MovePlatform";
import OnlyCoursePlatform from "./OnlyCoursePlatform";

function TypesPlatform({ data, zoom, machines }) {

  if (data.modelType === MODELS.FPSO || data.modelType === MODELS.FPU || data.modelType === MODELS.FSO)
    return (
      <>
        <OnlyCoursePlatform
          machines={machines}
          key={nanoid(5)} data={data} zoom={zoom} />
      </>
    );

  if (data.modelType === MODELS.DRILLING)
    return (
      <>
        <MovePlatform
          machines={machines}
          key={nanoid(5)}
           data={data} zoom={zoom} />
      </>
    );

  return (
    <>
      <FixedPlatform
        machines={machines}
        key={nanoid(5)}
        data={data}
        zoom={zoom} />
    </>
  );
}

const mapStateToProps = (state) => ({
  machines: state.fleet.machines
});

export default connect(mapStateToProps, undefined)(TypesPlatform)
