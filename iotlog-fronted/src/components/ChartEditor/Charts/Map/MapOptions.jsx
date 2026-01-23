import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { Button, Select } from "@paljs/ui";
import { RowMachineMapPinEditor } from "./RowMachineMapPinEditor";
import TextSpan from "../../../Text/TextSpan";
import { debounce } from "underscore";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const MapOptions = (props) => {
  const { optionsData } = props;
  const intl = useIntl();

  let types_map = [
    {
      value: "default",
      label: intl.formatMessage({ id: "default" }),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      value: "earth",
      label: intl.formatMessage({ id: "earth" }),
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    },
    {
      value: "rivers",
      label: intl.formatMessage({ id: "rivers" }),
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
    },
    {
      value: "simple",
      label: intl.formatMessage({ id: "simple" }),
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png",
      attribution: `IoTLog &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`,
    },
    {
      value: "relief",
      label: intl.formatMessage({ id: "relief" }),
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    },
    {
      value: "fleet",
      label: intl.formatMessage({ id: "fleet" }),
      url: null
    }
    // {
    //   value: "smooth",
    //   label: intl.formatMessage({ id: "smooth" }),
    //   url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    // },
    // {
    //   value: "smoothdark",
    //   label: intl.formatMessage({ id: "smooth.dark" }),
    //   url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    // },
  ];

  const verifyDisabled = () => {
    const allDataRequired = !!optionsData?.title;
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

  const onChangeItemOfList = (index, listName, prop, value) => {
    let item = props.optionsData[listName][index];
    item[prop] = value;
    props.setOptionsData({
      ...props.optionsData,
      [listName]: [
        ...props.optionsData[listName].slice(0, index),
        item,
        ...props.optionsData[listName].slice(index + 1),
      ],
    });
    verifyDisabled();
  };

  const changeValueDebounced = debounce((index, listName, prop, value) => {
    onChangeItemOfList(index, listName, prop, value);
  }, 500);

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="title" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="type.map.placelholder" />
          </TextSpan>
          <Select
            className="mt-1"
            options={types_map}
            placeholder={intl.formatMessage({ id: "type.map.placelholder" })}
            value={optionsData?.typeMap}
            onChange={(value) => onChange("typeMap", value)}
            menuPosition="fixed"
          />
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="zoom.init.label" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.zoomInit}
              onChange={(e) => onChange("zoomInit", parseInt(e.target.value))}
              type="number"
              min={1}
              max={50}
              placeholder={intl.formatMessage({
                id: "zoom.init.label",
              })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="size.decimals" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.sizeDecimals}
              onChange={(e) =>
                onChange("sizeDecimals", parseInt(e.target.value))
              }
              type="number"
              min={1}
              max={50}
              placeholder={intl.formatMessage({
                id: "size.decimals",
              })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }}>
          <Button
            size="Tiny"
            status="Info"
            className="mb-4"
            disabled={optionsData?.machines?.length === 1}
            onClick={() => {
              if (optionsData?.machines?.length) {
                onChange("machines", [...optionsData?.machines, {}]);
                return;
              }
              onChange("machines", [{}]);
            }}
          >
            <FormattedMessage id="add.sensor" />
          </Button>
          {optionsData?.machines?.map((itemLineData, i) => (
            <RowMachineMapPinEditor
              key={i}
              onChange={(prop, value) =>
                onChangeItemOfList(i, "machines", prop, value)
              }
              changeValueDebounced={(prop, value) => changeValueDebounced(i, "machines", prop, value)}
              data={itemLineData}
              onRemove={() => {
                onChange(
                  "machines",
                  optionsData?.machines.filter((x, j) => j != i)
                );
              }}
            />
          ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(MapOptions);
