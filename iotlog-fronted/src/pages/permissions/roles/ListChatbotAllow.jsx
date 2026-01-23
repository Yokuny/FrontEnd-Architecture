import React from "react";
import { FormattedMessage } from "react-intl";
import { Checkbox } from "@paljs/ui/Checkbox";
import { Row } from "@paljs/ui";
import { useFetch } from "../../../components/Fetch/Fetch";
import { LoadingCard } from "../../../components";


export default function ListChatbotAllow({ data, onChange }) {
  const { data: permissions, isLoading } = useFetch("/role/chatbotallowed");

  return (
    <>
      <LoadingCard isLoading={isLoading}>
        {permissions?.map((item, j) => {
          const checked = !!data[item.value];
          return (
            <Row key={`${j}`} className="mt-2">
              <Checkbox
                checked={checked}
                onChange={() => onChange(item.value, !checked)}
              >
                <FormattedMessage id={item.code} />
              </Checkbox>
            </Row>
          );
        })}
      </LoadingCard>
    </>
  );
}
