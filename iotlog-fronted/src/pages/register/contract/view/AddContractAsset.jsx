import { Button, Col, EvaIcon, InputGroup, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import {
  DateTime,
  InputDecimal,
  LabelIcon,
  SelectContractAssetEnterprise,
  SelectMachineEnterprise,
  TextSpan,
} from "../../../../components";
import { Money, Vessel } from "../../../../components/Icons";
import InputDateTime from "../../../../components/Inputs/InputDateTime";

const ContainerRow = styled(Row)`
  input {
    line-height: 1rem;
  }
  a {
    top: 6px;
  }

  margin-bottom: -10px;
`;

export default function AddContractAsset(props) {
  const { contractAssetItem, onChangeItem, onRemove, idEnterprise } = props;
  const theme = useTheme();
  const intl = useIntl();

  const optionsType = [
    {
      value: "CHARTERED",
      label: intl.formatMessage({ id: "chartered" }),
    },
    {
      value: "OWN",
      label: intl.formatMessage({ id: "own" }),
    },
  ];

  return (
    <>
      <Row className="m-2 mb-4">
        <Col breakPoint={{ md: 11 }}>
          <ContainerRow>
            <Col breakPoint={{ md: 4 }} className="mb-2">
              <LabelIcon
                renderIcon={() => (
                  <Vessel
                    style={{
                      height: 13,
                      width: 13,
                      color: theme.textHintColor,
                      marginRight: 5,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  />
                )}
                title={`${intl.formatMessage({ id: "vessel" })} *`}
              />
              <div className="mt-1"></div>
              <SelectMachineEnterprise
                idEnterprise={idEnterprise}
                onChange={(value) => onChangeItem("machine", value)}
                placeholder="machine.placeholder"
                value={contractAssetItem?.machine}
              />
            </Col>
            <Col breakPoint={{ md: 2 }} className="mb-2">
              <LabelIcon
                iconName="file-text-outline"
                title={<FormattedMessage id="type" />}
              />
              <Select
                options={optionsType}
                value={optionsType?.find(
                  (x) => x.value === contractAssetItem?.typeAsset
                )}
                onChange={(value) =>
                  onChangeItem("typeAsset", value?.value || null)
                }
                isClearable
                menuPosition="fixed"
                noOptionsMessage={() =>
                  intl.formatMessage({ id: "nooptions.message" })
                }
                placeholder={`${intl.formatMessage({ id: "type" })}`}
              />
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-2">
              <LabelIcon
                renderIcon={() => (
                  <Money
                    style={{
                      height: 13,
                      width: 13,
                      fill: theme.textHintColor,
                      marginRight: 5,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  />
                )}
                title={intl.formatMessage({ id: "daily.price" })  + " (USD)"}
              />
              <InputGroup fullWidth style={{ height: 36, marginTop: 1.9 }}>
                <InputDecimal
                  onChange={(e) => onChangeItem("daily", {
                    ...contractAssetItem?.daily,
                    USD: e,
                  })}
                  value={contractAssetItem?.daily?.USD}
                  sizeDecimals={2}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-2">
              <LabelIcon
                renderIcon={() => (
                  <Money
                    style={{
                      height: 13,
                      width: 13,
                      fill: theme.textHintColor,
                      marginRight: 5,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  />
                )}
                title={intl.formatMessage({ id: "daily.price" }) + " (BRL)"}
              />
              <InputGroup fullWidth style={{ height: 36, marginTop: 1.9 }}>
                <InputDecimal
                  onChange={(e) => onChangeItem("daily", {
                    ...contractAssetItem?.daily,
                    BRL: e,
                  })}
                  value={contractAssetItem?.daily?.BRL}
                  sizeDecimals={2}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-2">
              <LabelIcon
                iconName="home-outline"
                title={<FormattedMessage id="enterprise" />}
              />
              <InputGroup fullWidth>
                <input
                  type="text"
                  value={contractAssetItem?.enterpriseName}
                  onChange={(e) =>
                    onChangeItem("enterpriseName", e.target.value)
                  }
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-2">
              <LabelIcon
                iconName="calendar-outline"
                title={`${intl.formatMessage({ id: "start" })} *`}
              />
              <InputDateTime
                onChange={(value) => onChangeItem("dateInit", value)}
                value={contractAssetItem?.dateInit}
              />
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-2">
              <LabelIcon
                iconName="calendar-outline"
                title={<FormattedMessage id="end" />}
              />
              <InputDateTime
                onChange={(value) => onChangeItem("dateEnd", value)}
                value={contractAssetItem?.dateEnd}
                min={contractAssetItem?.dateInit}
              />
            </Col>
          </ContainerRow>
        </Col>
        <Col breakPoint={{ md: 1 }} className="col-flex-center">
          <Button
            status="Danger"
            size="Tiny"
            className="mt-1"
            appearance="ghost"
            onClick={onRemove}
          >
            <EvaIcon name="trash-2-outline" />
          </Button>
        </Col>
      </Row>
    </>
  );
}
