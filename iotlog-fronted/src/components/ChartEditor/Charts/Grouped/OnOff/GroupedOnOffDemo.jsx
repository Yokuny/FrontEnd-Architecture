import { Col, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { withTheme } from "styled-components";
import { PowerOnOff } from "../../../../Icons";
import TextSpan from "../../../../Text/TextSpan";
import { ContainerChart } from "../../../Utils";

const GroupedOnOffDemo =({
  theme,
  height = 200,
  width = 200,
}) => {

  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow">
        <TextSpan apparence="s2">
          <FormattedMessage id="active.on.off" />
        </TextSpan>

        <Row middle="xs" center="xs"  style={{ maxWidth: width - 20 }} className="pt-2">
          {new Array(6).fill().map((x, i) => (
            <Col breakPoint={{ md: 4 }} className="mb-4" key={i}>
              <PowerOnOff
                style={{
                  height: 30,
                  width: 30,
                  color: i % 2 === 0 ? theme.colorSuccess500 : theme.colorDanger500
                }}
              />
            </Col>
          ))}
        </Row>

        <div></div>
      </ContainerChart>
    </>
  );
}

export default withTheme(GroupedOnOffDemo);
