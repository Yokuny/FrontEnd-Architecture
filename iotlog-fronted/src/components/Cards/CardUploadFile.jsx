import React from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardBody } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import TextSpan from "../Text/TextSpan";
import Col from "@paljs/ui/Col";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { formatterMbKb } from "../Utils";
import { SpinnerStyled } from "../Inputs/ContainerRow";

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
`;

const CardUploadFile = (props) => {
  const { file, onSave, onRemoveFile } = props;

  return (
    <React.Fragment>
      <Card style={{ width: "100%", height: "10rem" }}>
        <CardBody>
          <ColFlex>
            <EvaIcon status="Basic" name="file" />
            <TextSpan style={{ padding: 5, overflowWrap: 'anywhere', textAlign: 'center' }} className="mt-1" apparence="c2">{file?.originalname || file?.name || file?.path || file?.filename}</TextSpan>
            <TextSpan apparence="c1">
              {formatterMbKb(file.size)}
            </TextSpan>
          </ColFlex>
        </CardBody>

        <Button fullWidth status="Danger" size="Tiny" onClick={onRemoveFile}>
          <FormattedMessage id="delete" />
        </Button>
      </Card>

      { !file.uploaded && !onSave && <SpinnerStyled />}
    </React.Fragment>
  );
};

export { CardUploadFile };
