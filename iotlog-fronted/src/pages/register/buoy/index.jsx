import { Button, Card, CardHeader, Col, EvaIcon, Row } from '@paljs/ui';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ItemRow, ListSearchPaginated, TextSpan } from '../../../components';
import AddButton from '../../../components/Button/AddButton';

function BuoyList(props) {

  const navigate = useNavigate();

  const hasPermissionForm = props.items?.some((x) => x === "/buoy-form");

  const [isLoading, setIsLoading] = React.useState(true);
  const [idEnterprise, setIdEnterprise] = React.useState();

  React.useLayoutEffect(() => {
    if (props.enterprises?.length) {
      setIdEnterprise(props.enterprises[0].id);
      setIsLoading(false)
    }
  }, [props.enterprises]);

  function renderRow(data) {
    return (
      <ItemRow colorTextTheme={"colorInfo500"}
        style={{ flexWrap: "wrap", alignItems: 'center', padding: 18 }}>
        <Col breakPoint={{ md: 1 }}>
          <EvaIcon
            name="radio-button-on-outline"
            status="Info"
          />
        </Col>
        <Col breakPoint={{ xs: 5 }}><TextSpan apparence="s1">{data.item.name}</TextSpan></Col>
        <Col breakPoint={{ xs: 5 }}>
          <Row className="m-0" middle="xs">
            <EvaIcon name="pin-outline"
              status="Basic"
              options={{
                width: 17,
                height: 17,
              }}
            />
            <TextSpan apparence="s3" hint>{data.item.proximity}</TextSpan>
          </Row>
        </Col>
        {/* <Col breakPoint={{ xs: 1 }}><TextSpan apparence="s3">{moment(data.item.createAt).format('DD/MM/YYYY')}</TextSpan></Col> */}
        {hasPermissionForm && (
          <Col breakPoint={{ xs: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="Tiny"
                appearance="ghost"
                onClick={() => navigate(`/buoy-form?id=${data.item.id}`, { state: { idEnterprise } })}
              >
                <EvaIcon name="edit-2-outline" />
              </Button>
            </div>
          </Col>
        )}
      </ItemRow>
    )
  }

  return (
    <Card>
      <CardHeader>
        <Row between="xs" middle="xs">
          <div style={{ marginLeft: '1rem' }}>
            <FormattedMessage id="buoys" />
          </div>
          <AddButton
            onClick={() => navigate('/buoy-form', { state: { idEnterprise } })}
            disabled={isLoading || !hasPermissionForm}
          />
        </Row>
      </CardHeader>
      <ListSearchPaginated
        renderItem={(x) => renderRow(x)}
        pathUrlSearh="/buoy/list"
        filterEnterprise
        contentStyle={{
          justifyContent: "space-between",
          padding: 0,
        }}
      />
    </Card>
  )
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises
});

export default connect(mapStateToProps)(BuoyList);
