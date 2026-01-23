import { nanoid } from "nanoid";
import { connect } from "react-redux";
import { setEditorItem } from "../../../actions";
import ModalEditChart from "./ModalEditChart";

const Editor = (props) => {
  const { editorItem, setEditorItem } = props;
  return (
    <>
      <ModalEditChart
        key={nanoid(5)}
        data={editorItem}
        show={!!editorItem}
        onClose={() => setEditorItem(undefined)}
        showExports
        idEnterprise={props.idEnterprise}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  editorItem: state.dashboard.editorItem,
});

const mapDispatchToProps = (dispatch) => ({
  setEditorItem: (data) => {
    dispatch(setEditorItem(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
