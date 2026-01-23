import React from "react";

import { Button, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import {
  SelectMachine,
  SelectSensorByMachine,
} from "../../../Select";
import TextSpan from "../../../Text/TextSpan";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

const InputColor = styled.input`
  width: 50px;
  height: 35px;
  padding: 2px !important;
`;

const ContainerColor = styled(InputGroup)`
  display: flex !important;
  align-items: center !important;
`;

export const RowMachineMapPinEditor = ({
  data,
  onChange,
  changeValueDebounced,
  onRemove = undefined,
}) => {
  const hasRemove = !!onRemove;

  return (
    <>
      <Row middle="xs" className="mb-4">
        <Col breakPoint={{ md: hasRemove ? 11 : 12 }}>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-2">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="machine" />
              </TextSpan>
              <div className="mt-1"></div>
              <SelectMachine
                value={data?.machine}
                onChange={(value) => onChange("machine", value)}
                placeholder={"machine"}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-2">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="sensor" />
                {" (GPS)"}
              </TextSpan>
              <div className="mt-1"></div>
              <SelectSensorByMachine
                placeholder={"sensor"}
                idMachine={data?.machine?.value}
                value={data?.sensor}
                onChange={(value) => onChange("sensor", value)}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-2">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="sensor" />
                {" ("}
                <FormattedMessage id="heading" />
                {")"}
              </TextSpan>
              <div className="mt-1"></div>
              <SelectSensorByMachine
                placeholder={"sensor"}
                idMachine={data?.machine?.value}
                value={data?.sensorHeading}
                onChange={(value) => onChange("sensorHeading", value)}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mt-1">
              <ContainerColor>
                <InputColor
                  type="color"
                  defaultValue="#3366ff"
                  value={data?.colorPin}
                  onChange={(e) =>
                    changeValueDebounced("colorPin", e.target.value)
                  }
                />
                <TextSpan apparence="s1" className="ml-2">
                  <FormattedMessage id="color.pin" />
                </TextSpan>
              </ContainerColor>
            </Col>
            <Col breakPoint={{ md: 6 }} className="mt-1">
              <ContainerColor>
                <InputColor
                  type="color"
                  defaultValue="#3366ff"
                  value={data?.colorRoute}
                  onChange={(e) =>
                    changeValueDebounced("colorRoute", e.target.value)
                  }
                />
                <TextSpan apparence="s1" className="ml-2">
                  <FormattedMessage id="color.route" />
                </TextSpan>
              </ContainerColor>
            </Col>
          </Row>
        </Col>
        {/* <Col breakPoint={{ md: 3 }} className="mb-2">
          <UploadImage
            onAddFile={onChangeImage}
            value={image}
            maxSize={10485760}
            imagePreview={imagePreview}
            height={122}
            textAdd="add.icon"
          />
        </Col> */}
        {hasRemove && (
          <Col
            breakPoint={{ md: 1 }}
            style={{ justifyContent: "center" }}
            className="mb-2"
          >
            <Button status="Danger"
            appearance="ghost"
            size="Tiny" onClick={onRemove}>
              <EvaIcon name="trash-2-outline" />
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
};
