import { Button, CardFooter, Col, InputGroup, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Fetch, LabelIcon, Modal } from "../../components";
import { useEffect, useRef, useState } from "react";

export function JustifyModal({
  isShow,
  handleSave,
  handleClose
}) {
  const [item, setItem] = useState({});
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isLoadingRef = useRef(false);

  const intl = useIntl();

  useEffect(() => {
    if (isShow) {
      handleOpenJustify();
    }
  }, [isShow])

  const handleOpenJustify = () => {
    if (isLoadingRef.current) {
      return;
    }

    setIsLoading(true);
    Fetch.get(
      `/params?idEnterprise=${localStorage.getItem(
        "id_enterprise_filter"
      )}&type=JUSTIFY`
    )
      .then((reponse) => {
        if (reponse.data?.options?.length) {
          isLoadingRef.current = true;
          setOptions(reponse.data.options);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <Modal
        title={"justify"}
        show={isShow}
        onClose={() => handleClose()}
        size="Large"
        renderFooter={() => (
          <CardFooter>
            <Row end="xs">
              <Button
                status="Primary"
                size="Small"
                onClick={() => handleSave(item)}
                className="mr-3"
              >
                <FormattedMessage id="save" />
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        <Row>
          <Col breakPoint={{ xs: 12 }} className="mb-4">
            <LabelIcon
              iconName={"hash-outline"}
              title={intl.formatMessage({ id: "type" })}
              className="mb-1"
            />
            <Select
              options={options}
              placeholder={intl.formatMessage({
                id: "select.type.justification",
              })}
              isLoading={isLoading}
              onChange={(option) => setItem({ ...item, type: option.value })}
              value={options?.find((p) => p.value === item.type) || null}
            />
          </Col>
          <Col breakPoint={{ xs: 12 }}>
            <LabelIcon
              iconName={"text-outline"}
              title={"justificativa"}
              className="mb-1"
            />
            <InputGroup fullWidth>
              <textarea
                name="justify"
                id="justify"
                cols={300}
                rows={5}
                style={{ resize: "vertical" }}
                placeholder={intl.formatMessage({ id: "enter.justification" })}
                onChange={(e) => setItem({ ...item, description: e.target.value })}
                value={item.description}
              ></textarea>
            </InputGroup>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
