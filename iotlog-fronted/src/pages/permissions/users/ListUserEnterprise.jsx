import React from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { connect } from "react-redux";
import { EvaIcon } from "@paljs/ui/Icon";
import { List, ListItem } from "@paljs/ui/List";
import { SpinnerFull, UserImage } from "../../../components";
import Fetch from "../../../components/Fetch/Fetch";
import { useNavigate } from "react-router-dom";

const ListUserEnterprises = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const [ready, setReady] = React.useState(false);
  const navigate = useNavigate()
  const searchparams = new URL(window.location.href).searchParams;
  const id = searchparams.get("id");

  React.useLayoutEffect(() => {
    setReady(true);
    onGetData();
  }, []);

  React.useLayoutEffect(() => {
    if (ready) onGetData();
  }, [props.enterprises]);

  const onEdit = (permission) => {
    navigate(`/permission-user?id=${permission.id}`);
  };

  const hasPermissionEdit = props.items?.some((x) => x === `/permission-user`);

  const onGetData = () => {
    setIsLoading(true);
    let url = `/user/enterprises?id=${id}`
    const idEnterpriseFilter = localStorage.getItem("id_enterprise_filter");
    if (idEnterpriseFilter) {
      url += `&idEnterprise=${idEnterpriseFilter}`;
    }

    Fetch.get(url)
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
              <FormattedMessage id="permission.enterprises" />
              <Row>
                {hasPermissionEdit && (
                  <Col breakPoint={{ md: 6 }}>
                    <Button
                      size="Tiny"
                      status="Primary"
                      className="flex-between"
                      onClick={() => navigate(`/permission-user?idRef=${id}`)}
                    >
                      <EvaIcon name="shield-outline" className="mr-1" />
                      <FormattedMessage id="new.permission" />
                    </Button>
                  </Col>
                )}
              </Row>
            </Row>
          </Col>
        </CardHeader>
        <List>
          {data?.map((item, index) => (
            <ListItem key={index} style={{
              borderLeft: `6px solid #115C93`,
              justifyContent: "space-between",
            }}>
              <UserImage
                size="Large"
                image={item?.enterprise?.image?.url}
                title={item?.role?.map(x=> x.description)?.join(" / ")}
                name={item?.enterprise?.name}
              />
              {hasPermissionEdit && (
                <Button
                  size="Tiny"
                  status="Success"
                  onClick={() => onEdit(item)}
                >
                  <FormattedMessage id="edit" />
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(ListUserEnterprises);
