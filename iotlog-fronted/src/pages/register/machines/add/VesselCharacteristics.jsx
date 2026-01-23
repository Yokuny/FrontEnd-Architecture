import { Col, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { InputDecimal, LabelIcon, SelectCountry, TextSpan } from "../../../../components";
import SelectCIIReference from "../../model-machines/SelectCIIReference";
import { floatToStringBrazilian } from "../../../../components/Utils";
import CIIService from "../../../../components/cii/CIIService";

export default function VesselCharacteristics(props) {
  const { onChange, onChangeDimensions, data } = props;

  const intl = useIntl();

  const ciiReference = !!data?.typeVesselCIIReference
    ? CIIService.calculateCIIReference({
      typeVessel: data?.typeVesselCIIReference,
      dwt: data?.deadWeight,
      grossTonage: data?.grossTonnage
    })
    : null;

  return (<>
    <Row className='pt-4 pl-2 pr-2' style={{ margin: 0 }}>
      <Col breakPoint={{ md: 3 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          <label>MMSI</label>
        </TextSpan>
        <InputGroup fullWidth className="mt-1">
          <input
            type="text"
            placeholder="MMSI"
            onChange={(text) =>
              onChange("mmsi", text.target.value)
            }
            value={data?.mmsi}
            maxLength={150}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 3 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          <label>IMO</label>
        </TextSpan>
        <InputGroup fullWidth className="mt-1">
          <input
            type="text"
            placeholder="IMO"
            onChange={(text) =>
              onChange("imo", text.target.value)
            }
            value={data?.imo}
            maxLength={150}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 3 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          <FormattedMessage id="length.loa" />
        </TextSpan>
        <InputGroup fullWidth className="mt-1">
          <InputDecimal
            placeholder={intl.formatMessage({
              id: "length.loa",
            })}
            onChange={(e) =>
              onChange("lengthLoa", e ? e : 0)
            }
            value={data?.lengthLoa}
            sizeDecimals={2}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 3 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          <FormattedMessage id="width.vessel" />
        </TextSpan>
        <InputGroup fullWidth className="mt-1">
          <InputDecimal
            placeholder={intl.formatMessage({
              id: "width.vessel",
            })}
            onChange={(e) =>
              onChange("width", e ? e : 0)
            }
            value={data?.width}
            sizeDecimals={2}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 3 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          <FormattedMessage id="deadweight" />
        </TextSpan>
        <InputGroup fullWidth className="mt-1">
          <input
            type="number"
            placeholder={intl.formatMessage({
              id: "deadweight",
            })}
            onChange={(e) =>
              onChange("deadWeight", e.target.value ? parseInt(e.target.value) : 0)
            }
            value={data?.deadWeight}
            min={0}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 3 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          <FormattedMessage id="gross.tonage" />
        </TextSpan>
        <InputGroup fullWidth className="mt-1">
          <input
            type="number"
            placeholder={intl.formatMessage({
              id: "gross.tonage",
            })}
            onChange={(e) =>
              onChange("grossTonnage", e.target.value ? parseInt(e.target.value) : 0)
            }
            value={data?.grossTonnage}
            min={0}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 2 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          <FormattedMessage id="flag" />
        </TextSpan>
        <SelectCountry
          className="mt-1"
          onChange={(value) =>
            onChange("flag", value?.value)
          }
          value={data?.flag}
          placeholderID="flag"
        />
      </Col>
      <Col breakPoint={{ md: 2 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          <FormattedMessage id="year.build" />
        </TextSpan>
        <InputGroup fullWidth className="mt-1">
          <input
            type="number"
            placeholder={intl.formatMessage({
              id: "year.build",
            })}
            onChange={(e) =>
              onChange("yearBuilt", e.target.value ? parseInt(e.target.value) : 0)
            }
            value={data?.yearBuilt}
            min={1900}
          />

        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 2 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          Call Sign
        </TextSpan>
        <InputGroup fullWidth className="mt-1">
          <input
            type="text"
            placeholder={"Call sign"}
            onChange={(text) =>
              onChange("callSign", text.target.value)
            }
            value={data?.callSign}
            maxLength={15}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 4 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          {`${intl.formatMessage({ id: 'type.vessel' })} (CII reference)`}
        </TextSpan>
        <div className="mt-1"></div>
        <SelectCIIReference
          onChange={(value) => onChange("typeVesselCIIReference", value?.value)}
          value={data?.typeVesselCIIReference}
        />
      </Col>
      {!!data?.typeVesselCIIReference && <Col breakPoint={{ md: 2 }} className="mb-4">
        <TextSpan apparence="p2" hint>
          CII Reference
        </TextSpan>
        <InputGroup fullWidth className="mt-1">
          <input
            type="text"
            placeholder={"CII Ref"}
            value={ciiReference !== null ? floatToStringBrazilian(ciiReference, 4) : ''}
            readOnly
          />
        </InputGroup>
      </Col>}
      <Col breakPoint={{ md: 12 }} className="mb-4">
        <LabelIcon title={`AIS ${intl.formatMessage({ id: 'dimensions' })}`} />
        <Row className="m-0">
          <Col breakPoint={{ md: 3 }}>
            <LabelIcon
              title={`${intl.formatMessage({ id: 'distance.to.bow' })} (m)`}
            />
            <InputGroup fullWidth className="mt-1">
              <input
                type="number"
                onChange={(text) =>
                  onChangeDimensions("distanceToBow", parseInt(text.target.value))
                }
                value={data?.aisDimensions?.distanceToBow}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 3 }}>
            <LabelIcon
              title={`${intl.formatMessage({ id: 'distance.to.stern' })} (m)`}
            />
            <InputGroup fullWidth className="mt-1">
              <input
                type="number"
                onChange={(text) =>
                  onChangeDimensions("distanceToStern", parseInt(text.target.value))
                }
                value={data?.aisDimensions?.distanceToStern}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 3 }}>
            <LabelIcon
              title={`${intl.formatMessage({ id: 'distance.to.starboard' })} (m)`}
            />
            <InputGroup fullWidth className="mt-1">
              <input
                type="number"
                onChange={(text) =>
                  onChangeDimensions("distanceToStarboard", parseInt(text.target.value))
                }
                value={data?.aisDimensions?.distanceToStarboard}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 3 }}>
            <LabelIcon
              title={`${intl.formatMessage({ id: 'distance.to.port' })} (m)`}
            />
            <InputGroup fullWidth className="mt-1">
              <input
                type="number"
                onChange={(text) =>
                  onChangeDimensions("distanceToPortSide", parseInt(text.target.value))
                }
                value={data?.aisDimensions?.distanceToPortSide}
              />
            </InputGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  </>)
}
