import { Button, CardFooter, Checkbox, Col, InputGroup, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { toast } from "react-toastify";
import { Fetch, Modal, SpinnerFull, TextSpan } from "../../../components";
import { verifyIDInvalid } from "../../../components/Utils";

const ModalNewUserExternal = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  const onSave = () => {
    if (!props?.idEnterprise) {
      toast.warn(props.intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!data?.username) {
      toast.warn(props.intl.formatMessage({ id: "username.required" }));
      return;
    }

    if (verifyIDInvalid(data?.username)) {
      toast.warn(props.intl.formatMessage({ id: "username.invalid" }));
      return;
    }

    let dataSend = {
      idEnterprise: props.idEnterprise,
      username: data?.username,
      active: !!data?.active,
    };

    setIsLoading(true);
    Fetch.post("/userexternalintegration", dataSend)
      .then((response) => {
        setIsLoading(false);
        toast.success(props.intl.formatMessage({ id: "save.successfull" }));
        window.location.reload();
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const renderFooter = () => {
    return (
      <>
        <CardFooter>
          <Row className="mr-1 ml-1" between>
            <Button size="Small" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </>
    );
  };

  return (
    <>
      <Modal
        show={props.show}
        onClose={props.onRequestClose}
        size="Large"
        renderFooter={renderFooter}
        title={props.intl.formatMessage({ id: "add.user" })}
      >
        <Row>
          <Col breakPoint={{ md: 12 }} className="pt-4">
            <InputGroup fullWidth>
              <input
                type="text"
                placeholder={props.intl.formatMessage({
                  id: "username.name",
                })}
                onChange={(text) => onChange("username", text.target.value)}
                value={data?.username}
                maxLength={150}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 6 }} className="pt-4">
            <Checkbox
              checked={data?.active}
              onChange={(e) => onChange("active", !data?.active)}
            >
              <TextSpan apparence="s2">
                <FormattedMessage id="active.check" />
              </TextSpan>
            </Checkbox>
          </Col>
        </Row>
      </Modal>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default injectIntl(ModalNewUserExternal);
