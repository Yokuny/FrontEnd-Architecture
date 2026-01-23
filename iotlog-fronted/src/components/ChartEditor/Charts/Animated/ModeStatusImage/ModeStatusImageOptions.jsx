import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectMachine,
  SelectSensorByMachine,
  SelectSignalCreateable,
} from "../../../../Select";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../../actions";
import styled, { css } from "styled-components";
import TextSpan from "../../../../Text/TextSpan";
import { Button, EvaIcon, Spinner } from "@paljs/ui";
import UploadImage from "../../../../UploadFile/UploadImage";
import { Fetch } from "../../../../Fetch";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const SpinnerThemed = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;

const ModeStatusImageOptions = (props) => {
  const { intl, optionsData } = props;

  const [imagesPreview, setImagesPreview] = React.useState([]);
  const [imagesIsUpdating, setImagesIsUpdating] = React.useState([]);

  const verifyDisabled = () => {
    const allDataRequired =
      !!optionsData?.machine?.value && !!optionsData?.title;
    if (allDataRequired && props.disabled) {
      props.setDisabled(false);
    } else if (!allDataRequired && !props.disabled) {
      props.setDisabled(true);
    }
  };

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });
    verifyDisabled();
  };

  const onChangeItem = (index, prop, value) => {
    let optionStatus = props.optionsData.optionsStatus[index];

    optionStatus[prop] = value;

    props.setOptionsData({
      ...props.optionsData,
      optionsStatus: [
        ...props.optionsData.optionsStatus.slice(0, index),
        optionStatus,
        ...props.optionsData.optionsStatus.slice(index + 1),
      ],
    });
    verifyDisabled();
  };

  const onChangeImageItem = (index, prop, image) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      setImagesPreview([
        {
          index,
          image: reader.result,
        },
      ]);
    };
    setImagesIsUpdating([...imagesIsUpdating, index]);
    const data = new FormData();
    data.append("file", image);
    Fetch.post(`/file/upload?directory=chart_status_image`, data)
      .then((response) => {
        if (response.data) {
          onChangeItem(index, prop, {
            url: response.data.url,
            size: response.data.size,
            mimetype: response.data.mimetype,
            originalname: response.data.originalname,
          });
        }
        setImagesIsUpdating(imagesIsUpdating.filter((x) => x != index));
      })
      .catch((e) => {
        setImagesIsUpdating(imagesIsUpdating.filter((x) => x != index));
      });
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <InputGroup fullWidth>
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
          />
        </Col>

        <Col breakPoint={{ md: 4 }} className="mb-4">
          <SelectSensorByMachine
            placeholder={"sensor"}
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensor}
            onChange={(value) => onChange("sensor", value)}
          />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <SelectSignalCreateable
            placeholder={"signal"}
            onChange={(value) => onChange("signal", value)}
            value={optionsData?.signal}
            idMachine={optionsData?.machine?.value}
            sensorId={optionsData?.sensor?.value}
            noOptionsMessage={
              !optionsData?.sensorManual
                ? "select.first.sensor"
                : "nooptions.message"
            }
            sensorNew={!!optionsData?.sensor?.__isNew__}
          />
        </Col>

        <Col breakPoint={{ md: 12 }}>
          <Button
            size="Tiny"
            status="Info"
            className="mb-4"
            onClick={() => {
              if (optionsData?.optionsStatus?.length) {
                onChange("optionsStatus", [...optionsData?.optionsStatus, {}]);
                return;
              }
              onChange("optionsStatus", [{}]);
            }}
          >
            <FormattedMessage id="add.options" />
          </Button>
          {optionsData?.optionsStatus?.map((itemLineStatus, i) => (
            <Row key={i} className="mb-4">
              <Col breakPoint={{ md: 11 }}>
                <Row>
                  <Col breakPoint={{ md: 9 }}>
                    <Row>
                      <Col breakPoint={{ md: 12 }} className="mb-2">
                        <TextSpan apparence="s2">
                          <FormattedMessage id="value" />
                        </TextSpan>
                        <InputGroup fullWidth className="mt-1">
                          <input
                            value={itemLineStatus?.value}
                            style={{ lineHeight: "0.5rem" }}
                            onChange={(e) =>
                              onChangeItem(i, "value", e.target.value)
                            }
                            placeholder={intl.formatMessage({ id: "value" })}
                          />
                        </InputGroup>
                      </Col>
                      <Col breakPoint={{ md: 12 }} className="mb-2">
                        <TextSpan apparence="s2">
                          <FormattedMessage id="description" />
                        </TextSpan>
                        <InputGroup fullWidth className="mt-1">
                          <input
                            value={itemLineStatus?.description}
                            style={{ lineHeight: "0.5rem" }}
                            onChange={(e) =>
                              onChangeItem(i, "description", e.target.value)
                            }
                            placeholder={intl.formatMessage({
                              id: "description",
                            })}
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col breakPoint={{ md: 3 }} className="pt-5">
                    {imagesIsUpdating.some((x) => x == i) ? (
                      <SpinnerThemed status="Primary" size="Small" />
                    ) : (
                      <UploadImage
                        onAddFile={(image) =>
                          onChangeImageItem(i, "image", image)
                        }
                        value={itemLineStatus?.image}
                        maxSize={1048576}
                        imagePreview={
                          imagesPreview.find((x) => x.index == i)?.image
                        }
                        height={110}
                        textAdd="add.icon"
                      />
                    )}
                  </Col>
                </Row>
              </Col>
              <Col
                breakPoint={{ md: 1 }}
                style={{
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  status="Danger"
                  className="mt-4"
                  size="Tiny"
                  onClick={() => {
                    onChange(
                      "optionsStatus",
                      optionsData?.optionsStatus.filter((x, j) => j != i)
                    );
                    setImagesPreview(imagesPreview.filter((x) => x.index != i));
                  }}
                >
                  <EvaIcon name="trash-2-outline" />
                </Button>
              </Col>
            </Row>
          ))}
        </Col>

        <Col breakPoint={{ md: 12 }} className="mb-4">
          <InputGroup fullWidth>
            <input
              value={optionsData?.link}
              onChange={(e) => onChange("link", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({
                id: "link.open.chart",
              })}
            />
          </InputGroup>
        </Col>
      </ContainerRow>
    </>
  );
};

const mapStateToProps = (state) => ({
  disabled: state.dashboard.disabledButtonSave,
  optionsData: state.dashboard.data,
});

const mapDispatchToProps = (dispatch) => ({
  setDisabled: (disabled) => {
    dispatch(setDisabledSave(disabled));
  },
  setOptionsData: (data) => {
    dispatch(setDataChart(data));
  },
});

const ModeStatusImageOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModeStatusImageOptions);

export default injectIntl(ModeStatusImageOptionsRedux);
