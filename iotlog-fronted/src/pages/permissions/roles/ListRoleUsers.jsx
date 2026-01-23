import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Card, CardHeader } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { EvaIcon } from "@paljs/ui/Icon";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  SpinnerFull,
  UserImage,
  TextSpan,
  ColCenter,
  DeleteConfirmation,
} from "../../../components";
import { List, ListItem } from "@paljs/ui/List";
import Fetch from "../../../components/Fetch/Fetch";
import SelectUsersModal from "../../../components/Archive/ModalListRoleUsers";


const ListRoleUsers = (props) => {
  const intl = useIntl();
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const [showModal, setShowModal] = React.useState(false);

  const searchparams = new URL(window.location.href).searchParams;
  const id = searchparams.get("id");

  const idEnterprise =
    props.idEnterprises?.[0] || localStorage.getItem("id_enterprise_filter");

  React.useEffect(() => {
    if (idEnterprise) {
      onGetData();
    }
  }, [idEnterprise]);

  const onGetData = () => {

    const idEnterprise =
      props.idEnterprises?.[0] || localStorage.getItem("id_enterprise_filter");

    if (!idEnterprise) {
      return;
    }

    setIsLoading(true);
    let url = `/role/list/usersid-enterprise?idRole=${id}&idEnterprise=${idEnterprise}`;

    Fetch.get(url)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDelete = async (item, index) => {
    if (!item) return;
    try {
      setIsLoading(true);
      const idUser = item.idUser;
      const idRole = id;

      await Fetch.put("/role/remove-role-userid", {
        idUser,
        idRole,
        idEnterprise,
      });

      toast.success(intl.formatMessage({ id: "success.remove" }));
      setData((prevData) => [
        ...prevData.slice(0, index),
        ...prevData.slice(index + 1),
      ]);
      setIsLoading(false);
    } catch (err) {
      toast.error(intl.formatMessage({ id: "error.remove" }));
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between="xs">
              <FormattedMessage id="role.users" />
              <Button
                size="Tiny"
                className="flex-between"
                onClick={handleOpenModal}
              >
                <EvaIcon name="person-add-outline" className="mr-1" />
                {intl.formatMessage({ id: "role.user.permission" })}
              </Button>
            </Row>
          </Col>
        </CardHeader>

        <List>
          {data?.map((item, index) => (
            <ListItem
              key={index}
              style={{
                borderLeft: `6px solid #115C93`,
                justifyContent: "space-between",
              }}
            >
              <Col breakPoint={{ md: 8, sm: 7, is: 12 }}>
                <UserImage
                  size="Large"
                  image={item?.image?.url}
                  title={item?.email}
                  name={item?.name}
                />
              </Col>
              <ColCenter breakPoint={{ md: 3, sm: 4, is: 9, xs: 11 }}>
                {item.isUserSystem && (
                  <Row className="row-flex-center">
                    <EvaIcon
                      name="person-outline"
                      status="Basic"
                      className="mt-1"
                      options={{ height: 18, width: 16 }}
                    />
                    <TextSpan
                      style={{ marginTop: 2 }}
                      apparence="p2"
                      status="Basic"
                    >
                      <FormattedMessage id="user.system" />
                    </TextSpan>
                  </Row>
                )}
              </ColCenter>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
                breakPoint={{ md: 1, sm: 1, xs: 1 }}
              >
                <DeleteConfirmation
                  onConfirmation={() => handleDelete(item, index)}
                  placement="bottom"
                  message={<FormattedMessage id="remove.role.confirmation.user" />}>
                  <Button
                    size="Tiny"
                    className="align-items-center"
                    status="Danger"
                    appearance="ghost"
                  >
                    <EvaIcon name="trash-2-outline" />
                  </Button>
                </DeleteConfirmation>
              </Col>
            </ListItem>
          ))}
        </List>
      </Card>
      <SpinnerFull isLoading={isLoading} />


      {/* Modal de Seleção de Usuários */}
      {showModal && <SelectUsersModal
        show={showModal}
        onClose={handleCloseModal}
        idRole={id}
        onGetData={onGetData}
        idEnterprise={idEnterprise}
      />}
    </>
  );
};

const mapStateToProps = (state) => ({
  idEnterprises: state.enterpriseFilter.idEnterprises,
});

export default connect(mapStateToProps)(ListRoleUsers);
