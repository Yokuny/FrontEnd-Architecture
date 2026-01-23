import React from "react";
import { useMap } from "react-leaflet";
import { connect } from "react-redux";

function AjustSize(props) {
  const map = useMap();

  React.useEffect(() => {
    map.invalidateSize();
  }, [props.coordinates]);

  React.useEffect(() => {
    const time = setTimeout(() => {
      map.invalidateSize();
    }, 1000)

    return () => {
      if (time)
      clearTimeout(time);
    }
  }, [props.toggleMenu]);

  return null;
}

const mapStateToProps = (state) => ({
  toggleMenu: state.settings.toggleMenu,
});

export default connect(mapStateToProps, undefined)(AjustSize);
