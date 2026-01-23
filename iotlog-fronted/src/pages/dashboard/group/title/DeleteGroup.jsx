import { Button, EvaIcon } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { setListGroup } from "../../../../actions";
import { DeleteConfirmation, Fetch, SpinnerFull } from "../../../../components";

const DeleteGroup = (props) => {
  const { data, idDashboard } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();

  const remove = (idGroup) => {
    props.setListGroup(props.listGroup.filter(x => x.id !== idGroup))
  }

  const onRemove = (data) => {
    setIsLoading(true);
    Fetch.delete(`/dashboard/group?idDashboard=${idDashboard}&idGroup=${data.id}`)
      .then(response => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        remove(data.id)
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      });
  }

  return (<>
    <DeleteConfirmation
      onConfirmation={() => onRemove(data)}
      message={intl.formatMessage({ id: 'delete.group.specific' }).replace('{0}', data?.description)}>
      <Button
        className="ml-2"
        size="Small"
        status="Danger"
        appearance="ghost"
        style={{ padding: 2 }}>
        <EvaIcon name="trash-2-outline" />
      </Button>
    </DeleteConfirmation>
    <SpinnerFull isLoading={isLoading} />
  </>)
}

const mapStateToProps = (state) => ({
  listGroup: state.dashboard.listGroup,
});

const mapDispatchToProps = (dispatch) => ({
  setListGroup: (list) => {
    dispatch(setListGroup(list));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteGroup);
