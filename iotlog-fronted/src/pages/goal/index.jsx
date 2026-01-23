import {
  Button,
  Card,
  CardHeader,
  Col,
  ContextMenu,
  EvaIcon,
  Row,
} from "@paljs/ui";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import {
  ColCenter,
  Fetch,
  ListPaginated,
  SpinnerFull,
  TextSpan,
} from "../../components";
import { ItemRow } from "./styles";

export default function Goal() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const showGoal = (item) => {
    navigate(`/goal?id=${item.id}`);
  };

  function getData() {
    const idEnterpriseFilter = localStorage.getItem("id_enterprise_filter");
    setIsLoading(true);
    Fetch.get(`goals/enterprise/${idEnterpriseFilter}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const intl = useIntl();
  const theme = useTheme();

  const hasPermission = true;

  const renderItem = ({ item }) => {
    return (
      <ItemRow
        colorTextTheme={"colorPrimary600"}
        onClick={() => showGoal(item)}
      >
        <Col breakPoint={{ md: 1, xs: 12 }}>
          <EvaIcon
            name={"file-text-outline"}
            options={{
              fill: theme.colorPrimary600,
              width: 25,
              height: 25,
            }}
          />
        </Col>
        <ColCenter breakPoint={{ md: 10, xs: 12 }}>
          <TextSpan apparence="s1">{item?.name}</TextSpan>
        </ColCenter>
        {hasPermission && (
          <ColCenter breakPoint={{ md: 1 }}>
            <ContextMenu
              className="inline-block mr-1 text-start"
              placement="left"
              items={[
                {
                  icon: "edit-outline",
                  title: intl.formatMessage({ id: "edit" }),
                  link: { to: `/goal?id=${item.id}` },
                },
              ]}
              Link={Link}
            >
              <Button size="Tiny" status="Basic" className="mr-4">
                <EvaIcon name="more-vertical" />
              </Button>
            </ContextMenu>
          </ColCenter>
        )}
      </ItemRow>
    );
  };

  function handleNewGoal() {
    navigate("/goal");
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Row between="xs">
            <Col breakPoint={{ xs: 10, md: 11 }}>
              <FormattedMessage id="goal" />
            </Col>
            <Col breakPoint={{ xs: 2, md: 1 }}>
              <Button size="Small" onClick={handleNewGoal}>
                <FormattedMessage id="new" />
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <ListPaginated
          data={data}
          renderItem={renderItem}
          onPageChanged={({ currentPage, pageLimit }) =>
           {}
          }
          contentStyle={{
            justifyContent: "space-between",
            padding: 0,
          }}
        />
      </Card>

      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
