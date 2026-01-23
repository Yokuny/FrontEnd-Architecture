import React from "react";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { EvaIcon } from "@paljs/ui/Icon";
import styled from "styled-components";

const ButtonStyled = styled(Button) `
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  div {
    margin-right: 5px;
  }
`

const ButtonExport = (props) => {

  const onExport = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify([{ type: props.type, options: props.data }])], {type: 'text/json'});
    element.href = URL.createObjectURL(file);
    element.download = `${props.data.title || 'file'}.chart` ;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <>
      <Button size="Tiny" className="flex-between" disabled={props.disabled} onClick={onExport} status="Basic">
        <EvaIcon name="download-outline" className="mr-1" />
        <FormattedMessage id="export" />
      </Button>
    </>
  );
};

const mapStateToProps = (state) => ({
  disabled: state.dashboard.disabledButtonExport,
  data: state.dashboard.data,
});

const ButtonExportIntl = injectIntl(ButtonExport);
export default connect(mapStateToProps, undefined)(ButtonExportIntl);
