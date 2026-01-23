import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import {
  FetchSupport,
  SpinnerFull,
  Fetch,
  ListPaginated,
} from "../../../components";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import User from "@paljs/ui/User";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const ListUsersTeamSupport = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [enterprises, setEnterprises] = React.useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    loadingData();
  }, []);

  const loadingData = () => {
    setIsLoading(true);
    Fetch.get("/user/enterprise")
      .then((response) => {
        if (response.data?.length) {
          setEnterprises(response.data);
          onPageChanged({
            currentPage: 1,
            pageLimit: 5,
            enterprisesFilter: response.data,
          });
          return;
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onEdit = (user) => {
    navigate(
      `/add-user-team?idUser=${user.idUser}&idEnterprise=${user.idEnterprise}`
    );
  };

  const onPageChanged = ({
    currentPage,
    pageLimit,
    text = "",
    enterprisesFilter = undefined,
  }) => {
    if (!currentPage) return;
    const enterprisesFilterQuery = (enterprisesFilter || enterprises).map(
      (x, i) => `idEnterprises[]=${x.idEnterprise}`
    );
    let url = `/userenterprise/users/list?${enterprisesFilterQuery.join(
      "&"
    )}&page=${currentPage - 1}&size=${pageLimit}`;
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

  const hasPermissionAdd = props.items?.some((x) => x === "/add-user-team");

  const renderItem = ({ item, index }) => {
    const hasPermissionEdit = props.itemsByEnterprise?.some(
      (x) =>
        x.enterprise?.id == item.idEnterprise &&
        x.paths?.includes("/add-user-team")
    );
    return (
      <>
        <User
          title={`${item.description || ""}${item.description ? " / " : ""}${
            item.nameEnterprise
          }`}
          name={item.nameUser}
        />

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
              <FormattedMessage id="team.support" />
              {hasPermissionAdd && (
                <Button
                  size="Small"
                  status="Primary"
                  onClick={() => navigate(`/add-user-team`)}
                >
                  <FormattedMessage id="new.team" />
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
            borderLeft: `6px solid #091A7A`,
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

const ListUsersTeamSupportIntl = injectIntl(ListUsersTeamSupport);

export default connect(mapStateToProps, undefined)(ListUsersTeamSupportIntl);
