import { InputGroup } from "@paljs/ui";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Fetch, LabelIcon } from "../../../../components";
import styled from "styled-components";

const InputStyled = styled.input`
cursor: not-allowed;
`;

export default function AuthorField({ onChange, data }) {
  const [userData, setUserData] = useState({ 
    name: "", 
    id: "" 
  });

  useEffect(() => {
    if (data?.name && data?.id) {
      setUserData({ name: data.name, id: data.id });
    } else if (!userData.name || !userData.id) {
      Fetch.get('/user/me').then((response) => {
        const userName = response.data.name;
        const userId = response.data.id;
        setUserData({ name: userName, id: userId });
        onChange({ name: userName, id: userId });
      });
    }
  }, [data]);

  return (
    <>
        <LabelIcon
          iconName="person-outline"
          title={<FormattedMessage id="author" />}
        />
        <InputGroup fullWidth className="mt-1">
          <InputStyled
            type="text"
            value={userData.name || ''}
            readOnly
            className="form-control"
          />
        </InputGroup>
    </>
  );
}