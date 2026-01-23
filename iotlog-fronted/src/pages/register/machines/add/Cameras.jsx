import { Button, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import { LabelIcon } from "../../../../components";
import { FormattedMessage, useIntl } from "react-intl";

export default function Cameras({ onChangeItem, data, onChangeMaster }) {
  const intl = useIntl()

  return (
    <>
      <Row className='pt-4 pl-4 pr-2' style={{ margin: 0 }}>
        <Col breakPoint={{ md: 12 }} className={"pt-2"}>
          {data?.map((camera, index) =>
            <Row
              className="p-0 m-0 mb-2"
              key={index}
            >
              <Col breakPoint={{ md: 3 }}>
                <LabelIcon
                  title={intl.formatMessage({ id: "name" })}
                  iconName={"camera-outline"}
                />
                <InputGroup fullWidth>
                  <input
                    value={camera.name}
                    onChange={(e) => onChangeItem(index, 'name', e.target.value)}
                    type="text"
                    placeholder={intl.formatMessage({ id: "name" })}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: 8 }}>
                <LabelIcon
                  title={intl.formatMessage({ id: "link" })}
                  iconName={"attach-outline"}
                />
                <InputGroup fullWidth>
                  <input
                    type="text"
                    value={camera.link}
                    placeholder={intl.formatMessage({ id: "link" })}
                    onChange={(e) => onChangeItem(index, 'link', e.target.value)}
                  />
                </InputGroup>
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
                  onClick={() => onChangeMaster("cameras", data.filter((data) => data !== camera))}
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
            onClick={() => onChangeMaster("cameras", [...(data || []), { name: '', link: '' }])}
          >
            <EvaIcon name="camera-outline" className="mr-1" />
            <FormattedMessage id="add.camera" />
          </Button>
        </Col>

      </Row>
    </>
  );
}
