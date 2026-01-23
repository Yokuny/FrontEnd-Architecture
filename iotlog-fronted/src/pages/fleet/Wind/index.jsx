import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { setMapTech } from "../../../actions";
import { Fetch, SpinnerFull } from "../../../components";
import { decodeJwt } from "./Utils";
import WindMap from "./WindMap";

const Wind = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();

  const intl = useIntl();

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Fetch.get(`/setupenterprise/findapimap`)
      .then((response) => {
        if (response.data?.isConfigured === false) {
          toast.warn(intl.formatMessage({ id: "api.key.windy.not.setup" }));
          props.setMapTech("");
          return;
        }
        if (response.data?.token) {
          setData(response.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        props.setMapTech("");
      });
  };

  const dataDecode = data?.token ? decodeJwt(data.token) : "";

  return (
    <>
      {dataDecode && <WindMap token={dataDecode} machines={props.machines} />}
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  machines: state.fleet.machines,
});

const mapDispatchToProps = (dispatch) => ({
  setMapTech: (mapTech) => {
    dispatch(setMapTech(mapTech));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Wind);
