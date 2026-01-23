import React from "react";
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Col,
  EvaIcon,
  Popover,
  Row,
} from "@paljs/ui";
import styled from "styled-components";
import { TileLayer } from "react-leaflet";
import { FormattedMessage } from "react-intl";
import { nanoid } from "nanoid";
import { connect } from "react-redux";
import { LabelIcon, TextSpan } from "../../../components";
import NauticalCMAP from "../../fleet/Map/Nautical/NauticalCMAP";
import { useThemeSelected } from "../../../components/Hooks/Theme";
import NauticalCMAPDark from "../../fleet/Map/Nautical/NauticalCMAPDark";


const ContentFixed = styled.div`
  position: absolute;
  bottom: 8px;
  left: 10px;
  z-index: 999;
`;

const LayersMap = ({
  items
}) => {
  const [isShowSeaMark, setIsShowSeaMark] = React.useState(false);
  const [isShowECC, setIsShowECC] = React.useState(false);
  const [isShowNAV, setIsShowNAV] = React.useState(false);

  const { isDark } = useThemeSelected();

  const hasPermissionNauticalECC = items?.some(
    (x) => x === "/nautical-ecc"
  );

  const changeECC = (value) => {
    setIsShowECC(value);
    if (value && isShowNAV) {
      setIsShowNAV(false);
    }
  };

  const changeNAV = (value) => {
    setIsShowNAV(value);
    if (value && isShowECC) {
      setIsShowECC(false);
    }
  };

  const layerActive = isShowECC || isShowNAV || isShowSeaMark;

  return (
    <>
      <ContentFixed>
        <Popover
          trigger="click"
          placement="right"
          overlay={
            <Card style={{ marginBottom: 0, maxWidth: 280 }}>
              <CardBody style={{ padding: 0 }}>
                <Row style={{ margin: 0 }}>
                  <div className="pl-2 mt-1 mb-2">
                    <LabelIcon
                      iconName="layers-outline"
                      title={<FormattedMessage id="details" />}
                    />
                    <Col breakPoint={{ md: 12 }}>
                      <Checkbox
                        checked={isShowSeaMark}
                        onChange={() =>
                          setIsShowSeaMark((prevState) => !prevState)
                        }
                      >
                        <TextSpan apparence="s2">
                          <FormattedMessage id="data.maritme" />
                        </TextSpan>
                      </Checkbox>
                    </Col>
                    {/* {hasPermissionNauticalECC && <Col breakPoint={{ md: 12 }}>
                      <Checkbox
                        checked={isShowECC}
                        onChange={() => changeECC(!isShowECC)}
                      >
                        <TextSpan apparence="s2">
                          <FormattedMessage id="nautical.chart.brazil" /> - ENC
                        </TextSpan>
                      </Checkbox>
                    </Col>} */}
                    <Col breakPoint={{ md: 12 }}>
                      <Checkbox
                        checked={isShowNAV}
                        onChange={() => changeNAV(!isShowNAV)}
                      >
                        <TextSpan apparence="s2">
                          <FormattedMessage id="nautical.chart" />
                        </TextSpan>
                      </Checkbox>
                    </Col>
                  </div>
                </Row>
              </CardBody>
            </Card>
          }
        >
          <Button
            style={{ padding: 3 }}
            size="Tiny"
            status={!layerActive ? "Basic" : "Success"}
          >
            <EvaIcon name={layerActive ? "layers" : "layers-outline"} />
          </Button>
        </Popover>
      </ContentFixed>
      {isShowSeaMark && (
        <TileLayer
          attribution="&copy; open sea"
          url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
        />
      )}
      {/* {hasPermissionNauticalECC && isShowECC && <NauticalECCMap key={nanoid(5)} />} */}
      {isShowNAV
        ? isDark
          ? <NauticalCMAPDark key={nanoid(5)} />
          : <NauticalCMAP key={nanoid(5)} />
        : <></>}
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(LayersMap)
