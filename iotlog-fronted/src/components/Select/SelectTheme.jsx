import React from "react";
import Select from "@paljs/ui/Select";
import styled from "styled-components";
import { connect } from "react-redux";
import { setTheme } from "../../actions";
import { EvaIcon } from "@paljs/ui/Icon";
import { FormattedMessage } from 'react-intl';

const SelectStyled = styled(Select)`
  min-width: 150px;
`;

const Label = styled.span`
  display: flex;
  align-items: center;
`;

export const themeOptions = [
    {
      value: "default",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#a6c1ff" }} />
          <FormattedMessage id="default"/>
        </Label>
      ),
    },
    {
      value: "dark",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#192038" }} />
          <FormattedMessage id="dark"/>
        </Label>
      ),
    },
    {
      value: "cosmic",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#5a37b8" }} />
          <FormattedMessage id="cosmic"/>
        </Label>
      ),
    },
    {
      value: "corporate",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#3366ff" }} />
          <FormattedMessage id="corporate"/>
        </Label>
      ),
    },
  ];

const SelectTheme = (props) => (
  <>
    <SelectStyled
      isSearchable={false}
      shape="SemiRound"
      value={themeOptions.find((item) => item.value === props.theme)}
      options={themeOptions}
      onChange={({ value }) => props.setTheme(value)}
      menuPosition={props.isMenuFixed ? "fixed" : undefined}
    />
  </>
);

const mapStateToProps = (state) => ({
  theme: state.settings.theme,
});

const mapDispatchToProps = (dispatch) => ({
  setTheme: (theme) => {
    dispatch(setTheme(theme));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectTheme);
