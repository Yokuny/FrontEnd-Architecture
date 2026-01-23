import { EvaIcon } from "@paljs/ui/Icon";
import { Button } from "@paljs/ui/Button";
import Row from "@paljs/ui/Row";
import { FormattedMessage, useIntl } from "react-intl";
import React from "react";
import { connect } from "react-redux";
import ModalGroupAdd from "./ModalGroupAdd";
import { addGroup } from "../../../../actions";
import { nanoid } from "nanoid";
import { Fetch, SpinnerFull } from "../../../../components";
import { toast } from "react-toastify";


function AddGroup(props) {
  const { dragEnabled, idDashboard, listGroup } = props;
  const [show, setShow] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();

  const onAdd = (data) => {
    setIsLoading(true);
    const itemSaved = { id: nanoid(5), idDashboard, ...data }
    Fetch.patch('/dashboard/group', itemSaved)
      .then(response => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        setShow(false);
        props.addGroup(itemSaved);
      })
      .catch(e => {
        setIsLoading(false);
      });
  }

  return (
    <>
      {(!!dragEnabled || !listGroup?.length) &&
        <Row middle="xs" center="xs" className="mt-4 mb-4">
          <Button
            size="Small"
            status="Success"
            className="flex-between mt-2 mb-2"
            onClick={() => setShow(true)}>
            <EvaIcon name="plus-outline" className="mr-1" />
            <FormattedMessage id="add.group" />
          </Button>
        </Row>}
      {show && <ModalGroupAdd
        show={show}
        onClose={() => setShow(false)}
        onSave={onAdd}
      />}
      <SpinnerFull isLoading={isLoading} />
    </>
  )
}

const mapStateToProps = (state) => ({
  dragEnabled: state.dashboard.dragEnabled,
  listGroup: state.dashboard.listGroup,
});

const mapDispatchToProps = (dispatch) => ({
  addGroup: (group) => {
    dispatch(addGroup(group));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGroup);
