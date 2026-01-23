import React from "react";
import Select from "@paljs/ui/Select";
import styled from "styled-components";
import { connect } from "react-redux";
import { setLanguage } from "../../actions";
import { LANGUAGES } from "../../constants";
import { Fetch } from "../Fetch";

const SelectStyled = styled(Select)`
  min-width: 150px;
`;

const SelectLanguage = (props) => {
  const onChange = ({ value }) => {
    props.setLanguage(value);
    if (props.isSaveLanguage) {
      Fetch.patch(`/user/language`, { language: value })
        .then((response) => {})
        .catch((e) => {});
    }
  };

  return (
    <>
      <SelectStyled
        isSearchable={false}
        shape="SemiRound"
        options={LANGUAGES}
        value={LANGUAGES.find((item) => item.value === props.locale)}
        onChange={onChange}
        menuPosition={props.isMenuFixed ? "fixed" : undefined}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  locale: state.settings.locale,
});

const mapDispatchToProps = (dispatch) => ({
  setLanguage: (locale) => {
    dispatch(setLanguage(locale));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectLanguage);
