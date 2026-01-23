import { Col } from "@paljs/ui";
import styled from "styled-components";
import Item from "./ContentItem";

const ColStyled = styled(Col)`
input {
  line-height: 0.5rem;
}

input[type="date"] {
  line-height: 1.1rem;
}

input[type="time"] {
  line-height: 1.1rem;
}

#icondate {
  margin-top: -4px;
}
#icontime {
  margin-top: -4px;
}
`

export default function ContentItem({ field, data, onChange }) {
  return (
    <>
      <ColStyled breakPoint={{ md: field?.size, xs: 12, sm: 12 }} className="mb-4">
        <Item
          field={field}
          onChange={onChange}
          data={data}
          onChangeMaster={onChange}
        />
      </ColStyled>
    </>
  );
}
