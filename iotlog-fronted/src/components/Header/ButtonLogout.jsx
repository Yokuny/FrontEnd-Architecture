import React from 'react';
import { Button, EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/Auth";
import { resetItensMenu } from "../../actions";

function ButtonLogout(props) {

  const navigate = useNavigate();

  React.useEffect(() => {
    isThereToken();
  }, []);

  const isThereToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      onLogout();
      return;
    }
  };

  const { signOut } = useAuth();

  const onLogout = () => {
    props.resetItensMenu();
    signOut();
    navigate("/login");
  };


  return (<>
    <Button
      size="Small"
      status="Danger"
      fullWidth
      className="button-icon"
      onClick={onLogout}
    >
      <EvaIcon name="log-out-outline" className="mr-1" />
      <span>
        <FormattedMessage id="logout" />
      </span>
    </Button>
  </>)
}

const mapDispatchToProps = (dispatch) => ({
  resetItensMenu: () => {
    dispatch(resetItensMenu());
  },
});

export default connect(undefined, mapDispatchToProps)(ButtonLogout);
