import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Fetch, SpinnerFull } from "../../../components";
import { decodeJwt } from "../Wind/Utils";
import WindMapFrame from "./WindMapFrame";

const ForecastMap = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();

  const intl = useIntl();

  React.useLayoutEffect(() => {
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
      {dataDecode && <WindMapFrame token={dataDecode} machines={props.machines} />}
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  machines: state.fleet.machines,
});


export default connect(mapStateToProps, undefined)(ForecastMap);
