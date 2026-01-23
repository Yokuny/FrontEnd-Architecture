import { Col, InputGroup, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { LabelIcon } from "../../../components";



export default function Observation({ formData, onChange, intl }) {

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            iconName="file-text-outline"
            title={<FormattedMessage id="observation" />}
          />
          <InputGroup fullWidth className="mt-1">
            <textarea
              type="text"
              rows={4}
              value={formData?.observation}
              onChange={(e) => onChange("observation", e.target.value)}
              placeholder={intl.formatMessage({ id: "observation" })}
              disabled={!!formData?.isFinishVoyage}
            />
          </InputGroup>
        </Col>
      </Row>
    </>
  );
}
