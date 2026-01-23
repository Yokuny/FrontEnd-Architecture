import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { ListPaginated, SpinnerFull, TextSpan } from "../../../components";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import FetchSupport from "../../../components/Fetch/FetchSupport";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { useNavigate } from "react-router-dom";

const ColStyle = styled(Col)`
  display: flex;
  flex-direction: column;
`;

const ListConfigGlobal = (props) => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  React.useLayoutEffect(() => {
    onPageChanged({ currentPage: 1, pageLimit: 5 });
  }, []);

  const onEdit = (config) => {
    navigate(`/config-support?id=${config.id}`);
  };

  const renderItem = ({ item: config, index }) => {
    return (
      <>
        <ColStyle>
          <TextSpan apparence="s1" className="mb-2">
            {config.nameEnterprise}
          </TextSpan>
          <Row className="pl-3 mb-1">
            <EvaIcon name="clock-outline" status="Warning" />
            <TextSpan apparence="s2" className="ml-1 mr-1">{config.timeFirstAttendance}</TextSpan>

            <TextSpan apparence="p2">
              <FormattedMessage id="time.sla.first" />
            </TextSpan>
          </Row>
          <Row className="pl-3">
            <EvaIcon name="clock-outline" status="Danger" />
            <TextSpan apparence="s2" className="ml-1 mr-1">{config.timeSolution}</TextSpan>
            <TextSpan apparence="p2">
              <FormattedMessage id="time.sla.solution" />
            </TextSpan>
          </Row>
        </ColStyle>
        <Button size="Tiny" status="Success" onClick={() => onEdit(config)}>
          <FormattedMessage id="edit" />
        </Button>
      </>
    );
  };

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/configuration/list?page=${currentPage - 1}&size=${pageLimit}`;
    if (text) {
      url += `&search=${text}`;
    }

    setIsLoading(true);
    FetchSupport.get(url)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between>
              <FormattedMessage id="setup.sla.support" />
              <Button
                size="Small"
                status="Primary"
                onClick={() => navigate(`/config-support`)}
              >
                <FormattedMessage id="new.setup" />
              </Button>
            </Row>
          </Col>
        </CardHeader>
        <ListPaginated
          data={data?.rows}
          totalItems={data?.count}
          renderItem={renderItem}
          onPageChanged={onPageChanged}
          contentStyle={{
            borderLeft: `6px solid #ff267b`,
            justifyContent: "space-between",
          }}
        />
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default injectIntl(ListConfigGlobal);
