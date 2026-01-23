import { Col, InputGroup, Select } from "@paljs/ui";
import { LabelIcon } from "../../../../components";
import { InputDecimal } from "../../../../components/Inputs/InputDecimal";

export default function WeatherFields(props) {
  const {
    data,
    onChange
  } = props;

  const optionsDirection = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

  return <>

    <Col breakPoint={{ md: 6 }} className="mb-4">
      <LabelIcon
        title="Direção Vento *"
      />
      <Select
        options={optionsDirection.map(x => ({ value: x, label: x }))}
        placeholder="Direção Vento"
        value={data?.direcaoVento
          ? { value: data?.direcaoVento, label: data?.direcaoVento }
          : null}
        onChange={e => onChange('direcaoVento', e.value)}
        menuPosition="fixed"
        isClearable
      />
    </Col>


    <Col breakPoint={{ md: 6 }} className="mb-4">
      <LabelIcon
        title="Velocidade Vento (nós) *"
      />
      <InputGroup fullWidth>
        <InputDecimal
          onChange={(e) => onChange("velocidadeVento", e)}
          value={data?.velocidadeVento}
          sizeDecimals={2}
        />
      </InputGroup>
    </Col>

    <Col breakPoint={{ md: 6 }} className="mb-4">
      <LabelIcon
        title="Direção Corrente *"
      />
      <Select
        options={optionsDirection.map(x => ({ value: x, label: x }))}
        placeholder="Direção Corrente"
        value={data?.direcaoCorrente
          ? { value: data?.direcaoCorrente, label: data?.direcaoCorrente }
          : null}
        onChange={e => onChange('direcaoCorrente', e.value)}
        menuPosition="fixed"
        isClearable
      />
    </Col>


    <Col breakPoint={{ md: 6 }} className="mb-4">
      <LabelIcon
        title="Velocidade Corrente (nós) *"
      />
      <InputGroup fullWidth>
        <InputDecimal
          onChange={(e) => onChange("velocidadeCorrente", e)}
          value={data?.velocidadeCorrente}
          sizeDecimals={2}
        />
      </InputGroup>
    </Col>

    <Col breakPoint={{ md: 6 }} className="mb-4">
      <LabelIcon
        title="Direção Swell *"
      />
      <Select
        options={optionsDirection.map(x => ({ value: x, label: x }))}
        placeholder="Direção Swell"
        value={data?.direcaoSwell
          ? { value: data?.direcaoSwell, label: data?.direcaoSwell }
          : null}
        onChange={e => onChange('direcaoSwell', e.value)}
        menuPosition="fixed"
        isClearable
      />
    </Col>


    <Col breakPoint={{ md: 6 }} className="mb-4">
      <LabelIcon
        title="Altura Swell (m) *"
      />
      <InputGroup fullWidth>
        <InputDecimal
          onChange={(e) => onChange("alturaSwell", e)}
          value={data?.alturaSwell}
          sizeDecimals={2}
        />
      </InputGroup>
    </Col>
  </>
}
