import { EvaIcon } from "@paljs/ui";
import { Button } from "@paljs/ui/Button";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import { ItemRow, ListSearchPaginated, TextSpan } from "../../../components";
import { Function } from "../../../components/Icons";
import SensorFunctionUtils from "./utils";

function SensorFunctionsList(props) {

  const theme = useTheme();

  const navigate = useNavigate();

  const [idEnterprise, setIdEnterprise] = React.useState();

  React.useEffect(() => {
    if (props.enterprises?.length) {
      setIdEnterprise(props.enterprises[0].id)
    }
  }, [props.enterprises]);

  function renderRow({ item }) {
    return (
      <ItemRow
        colorTextTheme={!item.enabled ? "colorBasic500" : "colorPrimary500"}
        style={{
          backgroundColor: !item.enabled && theme.colorBasic200,
          flexWrap: "wrap", alignItems: 'center'
        }}>
        <Col breakPoint={{ md: 1 }}>
          <Function style={{
            height: 24, width: 24, fill:
              item.enabled
                ? theme.colorPrimary500
                : theme.colorBasic500
          }} />
        </Col>
        <Col breakPoint={{ md: 3 }}>
          <TextSpan apparence="s1" hint={!item.enabled}>{item.description}</TextSpan>
        </Col>
        <Col breakPoint={{ md: 3 }}>
          <TextSpan apparence="p2" hint>{SensorFunctionUtils.replacePlaceholdersWithArray(item.algorithm, item.sensorsIn)}</TextSpan>
        </Col>
        <Col breakPoint={{ md: 3 }}>
          <Row>
            {item.machines.map((machine, index) => (
              <div key={index}>
                <TextSpan apparence={!item.enabled ? "p3" : "s3"} hint>
                  {machine.label}
                  {index < item.machines?.length - 1 && ',\u00A0'}
                </TextSpan>
              </div>
            ))}
          </Row>
        </Col>
        <Col breakPoint={{ md: 1 }}>
          {!item.enabled && <TextSpan
            apparence="s3"
            style={{
              textTransform: 'uppercase',
              color: '#fff',
              backgroundColor: theme.colorBasic500,
              borderRadius: '0.15rem',
              padding: '2px 4px'
            }}
          >
            <FormattedMessage id={"deactivate"} />
          </TextSpan>}
        </Col>
        <Col breakPoint={{ md: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="Tiny"
              appearance="ghost"
              onClick={() => navigate(`/sensor-function-form?id=${item._id}`, { state: { idEnterprise: idEnterprise } })}
            >
              <EvaIcon name="edit-2-outline" />
            </Button>
          </div>
        </Col>
      </ItemRow>
    )
  }

  return (
    <Card>
      <CardHeader>
        <Row between="xs" middle>
          <TextSpan apparence="s1" style={{ marginLeft: '1rem' }}><FormattedMessage id="sensor.functions" /></TextSpan>
          <Col breakPoint={{ xs: 6 }}>
            <Row end="xs">
              <Button
                onClick={() => navigate('/sensor-function-form', { state: { idEnterprise } })}
                style={{ marginRight: '1rem' }}
                className="flex-between mt-8"
                size="Small"
                disabled={!idEnterprise}
              >
                <EvaIcon name="plus-circle-outline" className="mr-1" />
                <FormattedMessage id="add" />
              </Button>
            </Row>
          </Col>
        </Row>
      </CardHeader>
      <ListSearchPaginated
        renderItem={renderRow}
        pathUrlSearh='/sensor-function/list'
        filterEnterprise
        contentStyle={{
          justifyContent: "space-between",
          padding: 0,
        }}
      />
    </Card>
  );
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises
});

export default connect(mapStateToProps)(SensorFunctionsList);
