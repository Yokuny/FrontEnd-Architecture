import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import { InputGroup } from "@paljs/ui/Input";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { LabelIcon } from "../../../components";
import styled from "styled-components";

const ContainerRow = styled(Row)`
  padding: 0 1rem;
`;

const StyledInputGroup = styled(InputGroup)`
  input {
    line-height: 1.2rem;
    padding: 8px;
  }
`;

export default function Filter({ onFilterChange }) {

  return (
    <ContainerRow middle="xs" className="">
      <Col breakPoint={{ xs: 12, md: 12 }}
      style={{
        padding: 0
      }}
      >
        <LabelIcon
          iconName="search-outline"
          title={<FormattedMessage id="filter" />}
        />
        <StyledInputGroup fullWidth>
          <input
            type="text"
            placeholder=""
            onChange={(e) => onFilterChange(e.target.value)}
          />
        </StyledInputGroup>
      </Col>
    </ContainerRow>
  );
}

