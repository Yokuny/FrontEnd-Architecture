import React from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardBody } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import TextSpan from "../Text/TextSpan";
import Col from "@paljs/ui/Col";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { formatterMbKb } from "../Utils";

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TextSpanStyled = styled(TextSpan)`
  word-wrap: break-word;
  word-break: break-all;
  text-align: center;
  text-align-last: left;
`;

const ALink = styled.a`
  text-align: justify;
  text-justify: inter-word;
`;

const CardFile = (props) => {
  const { file } = props;

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <ColFlex>
            <EvaIcon status="Basic" name="file" />
            <ALink href={file.url} target="_blank" className="ml-1 mr-1">
              <TextSpanStyled className="mt-1 text-break" apparence="c2">
                {file.filename || file.url}
              </TextSpanStyled>
            </ALink>
            <TextSpan apparence="c1">
              {formatterMbKb(file.size)}
            </TextSpan>
          </ColFlex>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export { CardFile };
