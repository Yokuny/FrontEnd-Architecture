import React from "react";
import styled from "styled-components";
import Col from "@paljs/ui/Col";
import { useFetch } from "../../../components/Fetch/Fetch";
import { TextSpan, LoadingCard } from "../../../components";
import { FormattedMessage } from "react-intl";
import { Checkbox } from "@paljs/ui/Checkbox";

const Column = styled(Col)`
  display: flex;
  flex-direction: column;
`;

export default function ListPaths({ pathSelected, changeCheck }) {
  const { data, isLoading } = useFetch("/role/paths");

  return (
    <>
      <LoadingCard isLoading={isLoading}>
        {data?.map((path, i) => (
          <Column key={i} breakPoint={{ lg: 4, md: 4 }} className="mb-4">
            <TextSpan apparence="s1" className="mt-1 mb-2">
              <FormattedMessage id={path.codeLanguage} />
            </TextSpan>
            {path.items.map((item, j) => {
              const checked = pathSelected.find((x) => x == item.path);
              return (
                <Checkbox
                  key={`${i}-${j}`}
                  className="ml-2"
                  checked={checked}
                  onChange={() => changeCheck(item, checked)}
                >
                  <FormattedMessage id={item.codeLanguage} />
                  {item.isDeprecated && <TextSpan apparence="s2" className="ml-1">(DEPRECATED)</TextSpan>}
                </Checkbox>
              );
            })}
          </Column>
        ))}
      </LoadingCard>
    </>
  );
}
