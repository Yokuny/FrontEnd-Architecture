import { Button, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon } from "../../../../components";
import InputWhatsapp from "../../../../components/Inputs/InputWhatsapp";

export default function Contact(props) {

  const { onChange, onChangeItem, onChangeMaster, data, dataSheet } = props;

  const intl = useIntl()

  return (
    <>
      <Row className='pt-4 pl-4 pr-2' style={{ margin: 0 }}>
        <Col breakPoint={{ md: 4 }}>
          <LabelIcon
            title={intl.formatMessage({ id: "management.person" })}
            iconName={"person"}
          />
          <InputGroup fullWidth className="mb-4">
            <input
              value={dataSheet?.managementName}
              onChange={(e) => onChange("managementName", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "management.person" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 8 }} className={data?.contacts?.length ? "" : "pt-2"}>
          {data?.contacts?.map((x, i) =>
            <Row className="p-0 m-0 mb-2">
              <Col breakPoint={{ md: 6 }}>
                <LabelIcon
                  title={intl.formatMessage({ id: "name" })}
                  iconName={"person-outline"}
                />
                <InputGroup fullWidth>
                  <input
                    value={x.name}
                    onChange={(e) =>
                      onChangeItem(i, "name", e.target.value)
                    }
                    type="text"
                    placeholder={intl.formatMessage({ id: "name" })}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: 5 }}>
                <LabelIcon
                  title={intl.formatMessage({ id: "phone" })}
                  iconName={"phone-outline"}
                />
                <InputWhatsapp
                  value={x.phone}
                  onChange={(e) =>
                    onChangeItem(i, "phone", e)
                  }
                />
              </Col>
              <Col
                breakPoint={{ md: 1 }}
                style={{ justifyContent: "center" }}
                className="pt-4"
              >
                <Button
                  className="mt-2"
                  status="Danger"
                  size="Tiny"
                  appearance="ghost"
                  onClick={() => {
                    onChangeMaster(
                      "contacts",
                      data?.contacts.filter((x, j) => j != i)
                    );
                  }}
                >
                  <EvaIcon name="trash-2-outline" />
                </Button>
              </Col>
            </Row>)
          }
          <Button
            size="Tiny"
            status="Info"
            className="mb-4 mt-4 ml-4 flex-between"
            onClick={() => {
              if (data?.contacts?.length) {
                onChangeMaster("contacts", [...data?.contacts, {}]);
                return;
              }
              onChangeMaster("contacts", [{}]);
            }}
          >
            <EvaIcon name="phone-call-outline" className="mr-1" />
            <FormattedMessage id="add.contact" />
          </Button>
        </Col>

      </Row>
    </>
  )
}
