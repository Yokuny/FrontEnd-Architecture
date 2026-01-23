import { Col, InputGroup } from "@paljs/ui";
import { LabelIcon } from "../../../../components";
import { InputDecimal } from "../../../../components/Inputs/InputDecimal";

export default function DPFields(props) {
  const {
    data,
    onChange
  } = props;

  return <>
    <Col breakPoint={{ md: 4 }} className="mb-4">
      <LabelIcon
        title="Potência Thrusters (%) *"
      />
      <InputGroup fullWidth>
        <InputDecimal
          onChange={(e) => onChange("potenciaThruster", e)}
          value={data?.potenciaThruster}
          sizeDecimals={2}
        />
      </InputGroup>
    </Col>
    <Col breakPoint={{ md: 4 }} className="mb-4">
      <LabelIcon
        title="Aproamento embarcação *"
      />
      <InputGroup fullWidth>
        <InputDecimal
          onChange={(e) => onChange("aproamentoEmbarcacao", e)}
          value={data?.aproamentoEmbarcacao}
          sizeDecimals={1}
        />
      </InputGroup>
    </Col>
    <Col breakPoint={{ md: 4 }} className="mb-4">
      <LabelIcon
        title="Aproamento Unidade *"
      />
      <InputGroup fullWidth>
        <InputDecimal
          onChange={(e) => onChange("aproamentoUnidade", e)}
          value={data?.aproamentoUnidade}
          sizeDecimals={1}
        />
      </InputGroup>
    </Col>

  </>
}
