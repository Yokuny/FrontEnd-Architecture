import React from "react";
import styled, { css } from "styled-components";
import Col from "@paljs/ui/Col";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import { EnterpriseHeader, Fetch, SpinnerFull, TextSpan } from "../../../components";
import { FormattedMessage } from "react-intl";
import Row from "@paljs/ui/Row";
import { Button, Checkbox, EvaIcon, InputGroup, Spinner } from "@paljs/ui";
import ModalNewUserExternal from "./ModalNewUserExternal";
import { nanoid } from "nanoid";

const ContainerIcon = styled.a`
  position: absolute;
  right: 10px;
  top: 6px;
  cursor: pointer;
`;

const SpinnerStyled = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;

const ContainerRow = styled(Row)``;

const EnterpriseUserIntegration = (props) => {
  const idEnterprise = new URL(window.location.href).searchParams.get("id");

  const [isLoading, setIsLoading] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showToken, setShowToken] = React.useState([]);

  const [listData, setListData] = React.useState([]);
  const [changing, setChanging] = React.useState([]);

  React.useLayoutEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setIsLoading(true);
    Fetch.get(
      `/userexternalintegration/list/enterprise?idEnterprise=${idEnterprise}`
    )
      .then((response) => {
        setListData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const changeVisible = (id) => {
    const hasShow = showToken?.some((x) => x == id);
    if (hasShow) {
      setShowToken(showToken?.filter((x) => x != id));
    } else {
      setShowToken([...showToken, id]);
    }
  };

  const onChangeActive = (id, newStatus) => {
    setChanging([...changing, id]);
    Fetch.patch(`/userexternalintegration/active`, { id, active: newStatus })
      .then((response) => {
        setChanging(changing?.filter((x) => x != id));
        const listDataIndexToUpdate = listData.findIndex((x) => x.id == id);
        const dataToUpdate = listData[listDataIndexToUpdate];
        dataToUpdate.active = newStatus;
        setListData([
          ...listData.slice(0, listDataIndexToUpdate),
          dataToUpdate,
          ...listData.slice(listDataIndexToUpdate + 1),
        ]);
      })
      .catch((e) => {
        setChanging(changing?.filter((x) => x != id));
      });
  };

  return (
    <>
      <ContainerRow>
        <Col>
          <Card>
            <CardHeader>
              <EnterpriseHeader idEnterprise={idEnterprise} />
            </CardHeader>
            <CardBody>
              {listData?.map((data, i) => (
                <Row key={nanoid}>
                  <Col breakPoint={{ md: 5 }}>
                    <TextSpan apparence="s2">
                      <FormattedMessage id="username" />
                    </TextSpan>
                    <InputGroup fullWidth size="Small" className="mt-1 mb-4">
                      <input
                        type={"text"}
                        value={data?.username}
                        readOnly
                        onChange={(e) => {}}
                      />
                    </InputGroup>
                  </Col>
                  <Col breakPoint={{ md: 5 }}>
                    <TextSpan apparence="s2">Token</TextSpan>
                    <InputGroup fullWidth size="Small" className="mt-1 mb-4">
                      <input
                        type={
                          showToken?.some((x) => x == i) ? "text" : "password"
                        }
                        value={data?.token}
                        onChange={(e) => {}}
                      />
                      <ContainerIcon onClick={() => changeVisible(i)}>
                        <EvaIcon
                          name={
                            showToken?.some((x) => x == i)
                              ? "eye-outline"
                              : "eye-off-outline"
                          }
                          status="Basic"
                          options={{
                            animation: {
                              type: "pulse",
                              hover: true,
                            },
                          }}
                        />
                      </ContainerIcon>
                    </InputGroup>
                  </Col>
                  <Col
                    breakPoint={{ md: 2 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    className={"pt-1"}
                  >
                    {changing.some((x) => x === data.id) ? (
                      <SpinnerStyled status="Primary" />
                    ) : (
                      <Checkbox
                        checked={data?.active}
                        onChange={() => onChangeActive(data.id, !data?.active)}
                      >
                        <TextSpan apparence="s2">
                          <FormattedMessage id="active.check" />
                        </TextSpan>
                      </Checkbox>
                    )}
                  </Col>
                </Row>
              ))}
            </CardBody>
            <CardFooter>
              <Button
                status="Info"
                size="Small"
                onClick={() => setShowModal(true)}
              >
                <FormattedMessage id="new" />
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>

      <ModalNewUserExternal
        show={showModal}
        onRequestClose={() => setShowModal(false)}
        idEnterprise={idEnterprise}
      />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default EnterpriseUserIntegration;
