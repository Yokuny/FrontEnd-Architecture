import React from 'react';
import { Col, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon, SelectEnterprise, SelectModelMachine, SelectSensorByEnterprise, SelectFleet, UploadImage } from "../../../../components";

export default function General(props) {
  const { enterprise, onChange, data, setEnterprise, isEdit, setImagePreview, imagePreview, setImage, image, disabled } = props;
  const intl = useIntl();

  const onChangeImage = (imageAdd) => {
    setImage(imageAdd);
    const reader = new FileReader();
    reader.readAsDataURL(imageAdd);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  return (
    <>
      <Row className='pt-4' style={{ margin: 0 }}>
        <Col breakPoint={{ lg: 8, md: 6 }}>
          <Row style={{ margin: 0 }}>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <LabelIcon
                iconName="home-outline"
                title={<><FormattedMessage id="enterprise" /> *</>}
              />
              <div className="mt-1"></div>
              <SelectEnterprise
                onChange={(value) => setEnterprise(value)}
                value={enterprise}
                oneBlocked
              />
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                iconName="cloud-upload-outline"
                title={<><FormattedMessage id="machine.id.placeholder" /> *</>}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "machine.id.placeholder",
                  })}
                  onChange={(text) => onChange("id", text.target.value)}
                  value={data?.id}
                  maxLength={150}
                  disabled={isEdit}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 8 }} className="mb-4">
              <LabelIcon
                iconName="text-outline"
                title={<><FormattedMessage id="name" /> *</>}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "machine.name.placeholder",
                  })}
                  onChange={(text) =>
                    onChange("name", text.target.value)
                  }
                  value={data?.name}
                  maxLength={150}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 12 }} className="mb-4">
              <LabelIcon
                iconName="flash-outline"
                title={<FormattedMessage id="sensors" />}
              />
              <div className="mt-1"></div>
              <SelectSensorByEnterprise
                onChange={(value) => onChange("sensors", value)}
                value={data?.sensors}
                idEnterprise={enterprise?.value}
                isMulti
                isClearable
              />
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                iconName="hash-outline"
                title={<FormattedMessage id="code" />}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "code",
                  })}
                  onChange={(text) =>
                    onChange("code", text.target.value)
                  }
                  value={data?.code}
                  maxLength={150}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 8 }} className="mb-4">
              <LabelIcon
                iconName="alert-circle-outline"
                title={<FormattedMessage id="model.machine" />}
              />
              <div className="mt-1"></div>
              <SelectModelMachine
                onChange={(value) => onChange("modelMachine", value)}
                value={data?.modelMachine}
                idEnterprise={enterprise?.value}
              />
            </Col>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <LabelIcon
                iconName="navigation-outline"
                title={<FormattedMessage id="fleet" />}
              />
              <div className="mt-1"></div>
              <SelectFleet
                onChange={(value) => onChange("fleet", value)}
                value={data?.fleet}
                idEnterprise={enterprise?.value}
              />
            </Col>
          </Row>
        </Col>
        <Col breakPoint={{ lg: 4, md: 6 }} className="mt-4">
          <UploadImage
            onAddFile={onChangeImage}
            value={image}
            maxSize={10485760}
            imagePreview={imagePreview}
            height={295}
            disabled={disabled}
          />
        </Col>
      </Row>
    </>
  )
}
