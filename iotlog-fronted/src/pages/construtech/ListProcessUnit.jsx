import React from "react";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import {
  ColCenter,
  FetchSupport,
  IconRounded,
  ItemRow,
  ListPaginated,
  SpinnerFull,
  TextSpan,
} from "../../components";
import { EvaIcon } from "@paljs/ui";
import styled, { useTheme } from "styled-components";
import { useNavigate } from "react-router-dom";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ListProcessUnit = (props) => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    onPageChanged({ currentPage: 1, pageLimit: 5 });
  }, []);

  const hasPermissionAdd = props.items?.some((x) => x === "/process-add");

  const onEdit = (item) => {
    if (!hasPermissionAdd) return;
    navigate(`/process-add?id=${item.id}`);
  };

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/processunit/list?page=${currentPage - 1}&size=${pageLimit}`;
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

  const renderItem = ({ item, index }) => {
    return (
      <>
        <ItemRow colorTextTheme={"colorBasic700"} onClick={() => onEdit(item)}>
          <Col breakPoint={{ md: 1 }} className="col-flex-center">
            <IconRounded colorTextTheme={"colorBasic200"}>
              <EvaIcon
                name={"file-text"}
                options={{
                  fill: theme.colorBasic700,
                  width: 25,
                  height: 25,
                  animation: { type: "pulse", infinite: false, hover: true },
                }}
              />
            </IconRounded>
          </Col>
          <ColCenter breakPoint={{ md: 5 }}>
            <TextSpan apparence="s1">
              {item?.id?.toString()?.padStart(5, "0")}
            </TextSpan>
            <TextSpan apparence="p3">{item?.units?.name}</TextSpan>
          </ColCenter>
          <ColCenter breakPoint={{ md: 5 }}>
            <RowRead>
              <EvaIcon
                name="calendar-outline"
                className="mt-1"
                options={{ height: 17, width: 17, fill: theme.colorBasic700 }}
              />
              <TextSpan apparence="p3">
                {moment(item.dateInput).format("DD/MM/YYYY")}
              </TextSpan>
            </RowRead>
          </ColCenter>
          <ColCenter breakPoint={{ md: 1 }}>
            <div>
              {hasPermissionAdd && (
                <Button
                  size="Tiny"
                  status="Success"
                  onClick={() => onEdit(item)}
                >
                  <FormattedMessage id="edit" />
                </Button>
              )}
            </div>
          </ColCenter>
        </ItemRow>
      </>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between>
              <FormattedMessage id="process.units" />
              {hasPermissionAdd && (
                <Button
                  size="Small"
                  status="Primary"
                  onClick={() => navigate(`/process-add`)}
                >
                  <FormattedMessage id="add.process" />
                </Button>
              )}
            </Row>
          </Col>
        </CardHeader>
        <ListPaginated
          data={data?.rows}
          totalItems={data?.count}
          renderItem={renderItem}
          onPageChanged={onPageChanged}
          contentStyle={{
            justifyContent: "space-between",
            padding: 0,
          }}
        />
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(ListProcessUnit);
