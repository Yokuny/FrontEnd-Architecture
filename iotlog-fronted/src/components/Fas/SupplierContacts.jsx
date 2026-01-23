import * as React from "react";
import { useTheme } from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { List, ListItem } from "@paljs/ui/List";
import {Row, Col} from "@paljs/ui";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import {
  SpinnerFull,
  TextSpan,
  Fetch,
  Modal,
  Toggle,
  LabelIcon
} from "../";
import { useIntl } from "react-intl";

const SupplierContacts = ({
    data,
    show,
    onClose,
    onSetAdmin,
    ...props
  }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState();
  const [internalContacts, setInternalContacts] = React.useState([]);
  const [validateContract, setValidateContract] = React.useState(false);

  const intl = useIntl();

  React.useEffect(() => {
    if (data?.supplierConfig?.validateContract !== undefined) {
      setValidateContract(data?.supplierConfig.validateContract);
    }

    if (data?.contacts) {
      setInternalContacts(data?.contacts);
    }
  }, [data]);

  const onCheckAdmin = (newRole, index) => {
    const contactData = internalContacts[index];
    setIsLoading(true);
    Fetch.put(`fas/set-supplier-role`, {
      id: contactData.id,
      role: newRole
    })
      .then(response => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        onSetAdmin();
      })
      .catch(e => {
        toast.error(intl.formatMessage({ id:"error.save"}));
        setIsLoading(false);
      })
  }

  const onCheckValidateContract = async () => {
    // If the supplierConfig already exists, update it, if not, create it.
    setIsLoading(true);
    if (data?.supplierConfig?.id) {
      Fetch.put(
        `/fas/fassupplierconfig/${data.supplierConfig.id}`,
        { validateContract: !validateContract }
      ).then(response => {
        setValidateContract(response?.data?.validateContract);
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
      }).catch(_ => {
        toast.error(intl.formatMessage({ id:"error.save"}));
        setIsLoading(false);
      });
    } else {
      Fetch.post(`/fas/fassupplierconfig`, {
        razao: data.razao,
        codigoFornecedor: Number(data.codigoFornecedor),
        validateContract: true,
      }).then((_) => {
        setValidateContract(true);
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
      }).catch(e => {
        toast.error(intl.formatMessage({ id:"error.save"}));
        setIsLoading(false);
      });
    }
  }


  return (<Modal
    size="Large"
    show={show}
    title={intl.formatMessage({ id:"fas.contacts"})}
    styleContent={{
      padding: 0,
    }}
    onClose={onClose}>

    <Row className="p-4 m-0">
        <LabelIcon
            className="m-1"
            title={<FormattedMessage id="validate.contract" />}
          />
          <Toggle
            checked={validateContract}
            onChange={onCheckValidateContract}
          />
    </Row>
    <List style={{ maxHeight: "50vh" }}>
      <ListItem>
        <Col
          breakPoint={{ md: 1 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        </Col>
        <Col
          breakPoint={{ md: 4 }}
          style={{
            display: "flex",
            alignItems: "center",
          }}>
          <TextSpan apparence="p2" hint>
            {intl.formatMessage({ id:"name"})}
          </TextSpan>
        </Col>
        <Col
          breakPoint={{ md: 5 }}
          style={{
            display: "flex",
            alignItems: "center",
          }}>
          <TextSpan apparence="p2" hint>
            {intl.formatMessage({ id:"email" })}
          </TextSpan>
        </Col>
        <Col
          breakPoint={{ md: 2, xs: 12 }}
          className="mt-2 mb-2 col-center-middle"
        >
          <TextSpan apparence="p2" hint>
            {intl.formatMessage({ id:"role.admin" })}
          </TextSpan>
        </Col>
      </ListItem>
      {internalContacts?.map((supplier, index) => (
        <>
          <ListItem
            key={nanoid(4)}
            colorTextTheme={"colorPrimary500"}
            style={{ paddingTop: 27, paddingBottom: 27 }}>
            <Col
              breakPoint={{ md: 1 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EvaIcon
                name={"person-outline"}
                options={{
                  fill: theme.colorInfo500,
                  animation: { type: "pulse", infinite: false, hover: true },
                }}
              />
            </Col>
            <Col
              breakPoint={{ md: 4 }}
              style={{
                display: "flex",
                alignItems: "center",
              }}>
              <TextSpan apparence="s2">
                {supplier?.name ? supplier?.name : "-"}
              </TextSpan>
            </Col>
            <Col
              breakPoint={{ md: 5 }}
              style={{
                display: "flex",
                alignItems: "center",
              }}>
              <TextSpan apparence="p2">
                {supplier?.email}
              </TextSpan>
            </Col>
            <Col
              breakPoint={{ md: 2, xs: 12 }}
              className="mt-2 mb-2 col-center-middle"
            >
              <Toggle
                checked={supplier?.role === "admin"}
                onChange={() =>
                onCheckAdmin(supplier?.role === "admin" ? "default" : "admin", index)
                } />
            </Col>
          </ListItem>
        </>
      ))}
      <SpinnerFull isLoading={isLoading} />
    </List>
  </Modal>
  )
}

export default SupplierContacts;


