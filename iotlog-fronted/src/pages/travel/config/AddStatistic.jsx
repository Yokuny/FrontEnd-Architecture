import {
  Button,
  Checkbox,
  Col,
  EvaIcon,
  InputGroup,
  Row,
  Select,
} from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { IconRounded, TextSpan } from "../../../components";
import { SelectSensorByMachine } from "../../../components/Select";
import { VARIABLE_TYPE } from "../../../constants";

const EXPRESSION_CONDITION = {
  MIN: "min",
  MAX: "max",
  AVG: "avg",
  HEADING_PREDOMINANT: "predominant_heading",
  GEO_DISTANCE: "geo_distance",
  LAST_SUBSTRACT_FIRST: "last_substract_first",
};

export default function AddStatistic(props) {
  const { statistcItem, onChangeItem, onRemove, idMachine } = props;
  const intl = useIntl();
  const theme = useTheme();

  const optionsExpression = [
    {
      value: EXPRESSION_CONDITION.MIN,
      label: `${intl.formatMessage({ id: "minimum" })} (${
        EXPRESSION_CONDITION.MIN
      })`,
    },
    {
      value: EXPRESSION_CONDITION.MAX,
      label: `${intl.formatMessage({ id: "maximum" })} (${
        EXPRESSION_CONDITION.MAX
      })`,
    },
    {
      value: EXPRESSION_CONDITION.AVG,
      label: `${intl.formatMessage({ id: "average" })} (${
        EXPRESSION_CONDITION.AVG
      })`,
    },
    {
      value: EXPRESSION_CONDITION.LAST_SUBSTRACT_FIRST,
      label: `${intl.formatMessage({
        id: "last.substract.first",
      })} (last - first)`,
    },
    {
      value: EXPRESSION_CONDITION.HEADING_PREDOMINANT,
      label: `${intl.formatMessage({ id: "predominant.heading" })}`,
    },
  ];

  if (statistcItem?.sensor?.type === VARIABLE_TYPE.GEO) {
    optionsExpression.push({
      value: EXPRESSION_CONDITION.GEO_DISTANCE,
      label: `${intl.formatMessage({ id: "distance" })} (geo)`,
    });
  }

  return (
    <>
      <Row className="m-2 mb-4">
        <Col breakPoint={{ md: 1 }} className="col-flex-center">
          <IconRounded colorTextTheme={"colorInfo100"}>
            <EvaIcon
              name={"trending-up-outline"}
              options={{
                fill: theme.colorInfo600,
                width: 25,
                height: 25,
                animation: {
                  type: "pulse",
                  infinite: false,
                  hover: true,
                },
              }}
            />
          </IconRounded>
        </Col>
        <Col breakPoint={{ md: 10 }}>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="description" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  value={statistcItem?.description}
                  onChange={(e) => onChangeItem("description", e.target.value)}
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "description",
                  })}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 4 }} className="mb-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="sensor" />
              </TextSpan>
              <div className="mt-1"></div>
              <SelectSensorByMachine
                placeholder={"sensor"}
                idMachine={idMachine}
                value={statistcItem?.sensor}
                onChange={(value) => onChangeItem("sensor", value)}
              />
            </Col>
            <Col breakPoint={{ md: 3 }}>
              <TextSpan apparence="s2">
                <FormattedMessage id="condition" />
              </TextSpan>
              <Select
                className="mt-1"
                isClearable
                options={optionsExpression}
                menuPosition="fixed"
                placeholder={intl.formatMessage({ id: "condition" })}
                onChange={(value) => onChangeItem("condition", value)}
                value={statistcItem?.condition}
              />
            </Col>
            <Col breakPoint={{ md: 2 }} className="mb-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="unit" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  value={statistcItem?.unit}
                  onChange={(e) => onChangeItem("unit", e.target.value)}
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "unit",
                  })}
                />
              </InputGroup>
            </Col>
            {statistcItem?.condition?.value !==
              EXPRESSION_CONDITION.LAST_SUBSTRACT_FIRST && (
              <Col breakPoint={{ md: 3 }} className="pt-4">
                <Checkbox
                  checked={statistcItem?.isOnlyTravel}
                  onChange={(e) =>
                    onChangeItem("isOnlyTravel", !statistcItem?.isOnlyTravel)
                  }
                >
                  <TextSpan apparence="s2">
                    <FormattedMessage id="not.time.at.anchor" />
                  </TextSpan>
                </Checkbox>
              </Col>
            )}
          </Row>
        </Col>
        <Col breakPoint={{ md: 1 }} className="col-flex-center">
          <Button
            status="Danger"
            size="Tiny"
            className="mt-1"
            onClick={onRemove}
          >
            <EvaIcon name="trash-2-outline" />
          </Button>
        </Col>
      </Row>
    </>
  );
}
