import { connect } from "react-redux";
import NotificationComponent from "./NotificationComponent";

const NotificationBell = (props) => {
  return <NotificationComponent isOpen={props.isOpen} onToggle={props.onToggle} />;
};

const mapStateToProps = (state) => ({
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(NotificationBell);
