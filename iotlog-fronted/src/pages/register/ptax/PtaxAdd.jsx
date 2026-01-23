import { Button, CardFooter, Col, InputGroup, Row } from "@paljs/ui";
import moment from "moment";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { InputDecimal, LabelIcon, Modal } from "../../../components";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import { CotationSpan } from "./styles";
import { useCotation } from "./useCotation";

export default function PtaxAdd({
  data: initialData,
  handleSave,
  show,
  onClose,
}) {

  const [data, setData] = useState({
    value: initialData.value,
    date: initialData.date || new Date().toISOString(),
  });
  const { cotationDate, cotation } = useCotation(data);

  const intl = useIntl();

  useEffect(() => {
    if (initialData) {
      setData({
        value: initialData?.value,
        date: initialData?.date,
      });
    }

    return () => {
      setData({
        value: "",
        date: new Date(),
      });
    };
  }, [initialData]);

  return (
    <>
      <Modal
        show={show}
        title="PTAX"
        onClose={onClose}
        renderFooter={() => (
          <CardFooter>
            <Row end="md">
              <Col breakPoint={{ xs: 2, md: 2 }}>
                <Button
                  size="Small"
                  status="Success"
                  onClick={() => handleSave({ ...data, value: data.value || cotation.value, id: initialData?.id })}
                >
                  {intl.formatMessage({ id: "save" })}
                </Button>
              </Col>
            </Row>
          </CardFooter>
        )}
      >
        <Row>
          <Col breakPoint={{ xs: 12, md: 6 }}>
            <LabelIcon
              iconName="calendar-outline"
              title={intl.formatMessage({ id: "date" })}
            />
            <InputDateTime
              onlyDate={true}
              value={initialData?.date || data.date}
              onChange={(e) => {
                setData({ ...data, date: e });
              }}
            />
          </Col>
          <Col breakPoint={{ xs: 12, md: 6 }}>
            <LabelIcon
              iconName="hash-outline"
              title={intl.formatMessage({ id: "value" })}
            />
            <InputGroup fullWidth>
              <InputDecimal
                value={data?.value || cotation?.value}
                onChange={(e) => {
                  setData({ ...data, value: e });
                }}
              />
            </InputGroup>
            {cotationDate && <CotationSpan>
              {intl.formatMessage({ id: "quote.day" })}{" "}
              {moment(cotationDate).format("DD MMM YYYY")}
            </CotationSpan>}
          </Col>
        </Row>
      </Modal>
    </>
  );
}
