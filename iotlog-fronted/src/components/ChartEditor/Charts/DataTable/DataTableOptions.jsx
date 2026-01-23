import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { Button, Checkbox, EvaIcon } from "@paljs/ui";
import { ReactSortable } from "react-sortablejs";
import TextSpan from "../../../Text/TextSpan";
import { RowMachineSensorEditor } from "../../Utils";
import ColEditor from "./ColEditor";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const CustomComponent = React.forwardRef((props, ref) => {
  return <div ref={ref}>{props.children}</div>;
});

const DataTableOptions = (props) => {
  const { intl, optionsData } = props;

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
        <Col breakPoint={{ md: 12 }}>
          <Button
            size="Tiny"
            status="Info"
            className="mb-4"
            onClick={() => {
              if (optionsData?.rowData?.length) {
                onChange("rowData", [...optionsData?.rowData, {}]);
                return;
              }
              onChange("rowData", [{}]);
            }}
          >
            <FormattedMessage id="add.data.principal" />
          </Button>
          {optionsData?.rowData?.map((itemLineData, i) => (
            <RowMachineSensorEditor
              key={i}
              onChange={(prop, value) =>
                onChangeItemOfList(i, "rowData", prop, value)
              }
              data={itemLineData}
              onRemove={() => {
                onChange(
                  "rowData",
                  optionsData?.rowData.filter((x, j) => j != i)
                );
              }}
            />
          ))}
        </Col>
        {!!optionsData?.rowData?.length && [
          <Col breakPoint={{ md: 12 }}>
            <Button
              size="Tiny"
              status="Info"
              className="mb-4"
              onClick={() => {
                if (optionsData?.columnCross?.length) {
                  onChange("columnCross", [...optionsData?.columnCross, {}]);
                  return;
                }
                onChange("columnCross", [{}]);
              }}
            >
              <FormattedMessage id="add.data.cross" />
            </Button>
            {optionsData?.columnCross?.map((itemcolumnCross, i) => (
              <RowMachineSensorEditor
                key={`col-${i}`}
                onChange={(prop, value) =>
                  onChangeItemOfList(i, "columnCross", prop, value)
                }
                data={itemcolumnCross}
                onRemove={() => {
                  onChange(
                    "columnCross",
                    optionsData?.columnCross?.filter((x, j) => j != i)
                  );
                }}
              />
            ))}
          </Col>,
          <Col breakPoint={{ md: 12 }} className="mb-4">
            <Checkbox
              checked={optionsData?.isViewThanMoreZeroOrFalse}
              onChange={(e) =>
                onChange(
                  "isViewThanMoreZeroOrFalse",
                  !optionsData?.isViewThanMoreZeroOrFalse
                )
              }
            >
              <TextSpan apparence="s2">
                <FormattedMessage id="view.more.zero.false" />
              </TextSpan>
            </Checkbox>
          </Col>,
        ]}

        {!!optionsData?.rowData?.length && (
          <Col breakPoint={{ md: 12 }} className="mt-2">
            <Button
              size="Tiny"
              status="Success"
              className="mb-4"
              onClick={() => {
                if (optionsData?.columns?.length) {
                  onChange("columns", [...(optionsData?.columns || []), {}]);
                  return;
                }
                onChange("columns", [{}]);
              }}
            >
              <FormattedMessage id="add.column" />
            </Button>
            <ReactSortable
              list={optionsData?.columns || []}
              setList={(data) => onChange("columns", data)}
              tag={CustomComponent}
            >
              {optionsData?.columns?.map((itemCol, i) => (
                <ColEditor
                  key={`col-${i}`}
                  onChange={(prop, value) =>
                    onChangeItemOfList(i, "columns", prop, value)
                  }
                  data={itemCol}
                  columnCross={optionsData?.columnCross}
                  rowData={optionsData?.rowData}
                  onRemove={() => {
                    onChange(
                      "columns",
                      optionsData?.columns?.filter((x, j) => j != i)
                    );
                  }}
                />
              ))}
            </ReactSortable>
          </Col>
        )}
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

const DataTableOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataTableOptions);

export default injectIntl(DataTableOptionsRedux);
