import { Button, EvaIcon } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { setListGroup } from "../../../../actions";
import { Fetch, SpinnerFull } from "../../../../components";
import ModalGroupAdd from "./ModalGroupAdd";

const EditGroup = (props) => {
  const { data, idDashboard } = props;
  const [show, setShow] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();

  const onPress = (e) => {
    e.preventDefault();
    setShow(true)
  }

  const editLocal = (dataEdit) => {
    const toEditIndex = props.listGroup?.findIndex(x => x.id === dataEdit.id);
    const toEdit = props.listGroup[toEditIndex]
    toEdit.description = dataEdit.description
    props.setListGroup([
      ...props.listGroup.slice(0, toEditIndex),
      toEdit,
      ...props.listGroup.slice(toEditIndex + 1),
    ])
    setShow(false)
  }

  const onEdit = (data) => {
    setIsLoading(true);
    const dataEdit = { id: data.id, idDashboard, ...data }
    Fetch.patch('/dashboard/group', dataEdit)
    .then(response => {
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      editLocal(dataEdit)
      setIsLoading(false);
    })
    .catch(e => {
      setIsLoading(false);
    });
  }

  return (<>
    <Button className="ml-2" size="Small" appearance="ghost" onClick={onPress} style={{ padding: 2 }}>
      <EvaIcon name="edit-2-outline" />
    </Button>
    {show && <ModalGroupAdd
      show={show}
      onClose={() => setShow(false)}
      onSave={(d) => onEdit({...d, id: data.id})}
      description={data.description}
    />}
    <SpinnerFull isLoading={isLoading}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditGroup);
