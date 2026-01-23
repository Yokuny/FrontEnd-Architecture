import React from "react";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { SpinnerFull, Fetch } from "../../../components";
import { toast } from "react-toastify";
import { addGroup, addNewChart, setDataChart } from "../../../actions";

const ButtonSave = (props) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSave = () => {
    setIsLoading(true);
    const data = {
      idDashboard: props.idDashboard,
      idGroup: props.idGroup,
      type: props.type,
      options: props.data,
      id: props.id
    }
    Fetch.post("/chart", data)
      .then((response) => {
        const id = response.data?.data?.id;
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        props.setOptionsData(undefined)
        if (!data.id)
          data.id = id;
        data.height = 150;
        data.width = 150;
        data.idGroup = props.idGroup;
        props.addNewChart(data);
        props.onClose();
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Button size="Small" disabled={props.disabled} onClick={onSave}>
        <FormattedMessage id="save" />
      </Button>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  disabled: state.dashboard.disabledButtonSave,
  data: state.dashboard.data,
});

const mapDispatchToProps = (dispatch) => ({
  setOptionsData: (data) => {
    dispatch(setDataChart(data));
  },
  addNewChart: (data) => {
    dispatch(addNewChart(data))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonSave);
