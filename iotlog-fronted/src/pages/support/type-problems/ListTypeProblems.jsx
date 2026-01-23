import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { ListPaginated, SpinnerFull } from "../../../components";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import User from "@paljs/ui/User";
import FetchSupport from "../../../components/Fetch/FetchSupport";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const ListTypeProblems = (props) => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  React.useLayoutEffect(() => {
    onPageChanged({ currentPage: 1, pageLimit: 5 });
  }, []);

  const onEdit = (typeProblem) => {
    navigate(`/add-type-problem?id=${typeProblem.id}`);
  };

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/typeproblem/list?page=${currentPage - 1}&size=${pageLimit}`;
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

  const hasPermissionAdd = props.items?.some((x) => x === "/add-type-problem");

  const renderItem = ({ item, index }) => {
    const hasPermissionEdit = props.itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id == item.idEnterprise &&
        x.paths?.includes("/add-type-problem")
    )
    return (
      <>
        <User key={index} title={item.nameEnterprise} name={item.description} />

        {hasPermissionEdit && (
          <Button size="Tiny" status="Success" onClick={() => onEdit(item)}>
            <FormattedMessage id="edit" />
          </Button>
        )}
      </>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between>
              <FormattedMessage id="type.problem" />
              {hasPermissionAdd && (
                <Button
                  size="Small"
                  status="Primary"
                  onClick={() => navigate(`/add-type-problem`)}
                >
                  <FormattedMessage id="new.type" />
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
            borderLeft: `6px solid #B71713`,
            justifyContent: "space-between",
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

const ListTypeProblemsIntl = injectIntl(ListTypeProblems);

export default connect(mapStateToProps, undefined)(ListTypeProblemsIntl);
