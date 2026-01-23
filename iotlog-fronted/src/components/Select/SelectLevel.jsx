import React from "react";
import { useIntl, FormattedMessage } from "react-intl";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import Select from "@paljs/ui/Select";
import {LEVEL_NOTIFICATION}  from "../../constants/index";

const Label = styled.span`
    display: flex;
    align-items: center;
    justify-content: flex-start
`;

const SelectLevel = ({ onChange, value, isDisabled = false }) => {

  const intl = useIntl();

 const options = [
   {
     value: LEVEL_NOTIFICATION.CRITICAL,
     label: (
      <Label>
        <EvaIcon name="close-circle-outline" options={{ fill: "#d43542" }} />
        <span style={{marginRight: '7px'}}/>
        <FormattedMessage id="critical"/>
      </Label>
    )
   },
   {
    value: LEVEL_NOTIFICATION.WARNING,
    label:
    (
      <Label>
        <EvaIcon name="alert-triangle-outline" options={{ fill: "#d6cb36" }} />
        <span style={{marginRight: '7px'}}/>
        <FormattedMessage id="warn"/>
      </Label>
    ),
  },
  {
    value: LEVEL_NOTIFICATION.INFO,
    label: (
      <Label>
        <EvaIcon name="info-outline" options={{ fill: "#66b83a" }} />
        <span style={{marginRight: '7px'}}/>
        <FormattedMessage id="info"/>
      </Label>
    )
  },
 ]


  return (
      <Select
        options={options}
        placeholder={intl.formatMessage({
          id: "scale.level",
        })}
        onChange={onChange}
        value={options.find((item) => item.value === value)}
        isDisabled={isDisabled}
        menuPosition="fixed"
      />
  );
};

export default SelectLevel;
