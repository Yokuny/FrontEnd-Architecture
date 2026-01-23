import {
  Checkbox,
  Col,
  InputGroup,
  Row,
  Select,
} from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import {
  LabelIcon,
  SelectModelMachine,
  SelectUsers,
  TextSpan,
} from "../../../../components";
import { MeasureLine } from "../../../../components/Icons";
import FormType from "./../type";
import { useOptions } from "./useOptions";


const ItemField = (props) => {
  const intl = useIntl();
  const theme = useTheme();
  const {
    onChange,
    onRemove,
    field,
    level,
    allFields,
    idEnterprise,
    noShowInList,
    table,
    isDisableName
  } = props;

  const { optionsType, optionsSize } = useOptions({ level });

  return (
    <>
      <Col breakPoint={{ md: 12, xs: 12 }}>
        <Row>
          <Col breakPoint={{ md: 4 }} className="mb-2">
            <LabelIcon
              iconName="file-remove-outline"
              title={`${intl.formatMessage({ id: "field.name" })} *`}
            />
            <InputGroup fullWidth className="mt-1">
              <input
                type="text"
                placeholder={intl.formatMessage({
                  id: "field.name",
                })}
                onChange={(text) =>
                  onChange("description", text.target.value)
                }
                value={field?.description}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 3 }} className="mb-2">
            <LabelIcon
              iconName="options-2-outline"
              title={`${intl.formatMessage({ id: "type" })} *`}
            />
            <Select
              className="mt-1"
              options={optionsType}
              placeholder={intl.formatMessage({
                id: "type",
              })}
              value={optionsType?.find(
                (x) => x.value === field?.datatype
              )}
              onChange={(choose) => onChange("datatype", choose?.value)}
              menuPosition="fixed"
            />
          </Col>
          <Col breakPoint={{ md: 2 }} className="mb-2">
            <LabelIcon
              renderIcon={() => (
                <MeasureLine
                  style={{
                    height: 15,
                    width: 16,
                    fill: theme.textHintColor,
                    marginRight: 5,
                  }}
                />
              )}
              title={`${intl.formatMessage({ id: "size" })} *`}
            />
            <div style={{ marginTop: 6 }}></div>
            <Select
              className="mt-1"
              options={optionsSize}
              placeholder={intl.formatMessage({
                id: "size",
              })}
              value={optionsSize?.find((x) => x.value === field?.size)}
              onChange={(choose) => onChange("size", choose?.value)}
              menuPosition="fixed"
            />
          </Col>
          <Col breakPoint={{ md: 3 }} className="mb-2">
            <LabelIcon
              iconName="hash-outline"
              title={`ID *`}
            />
            <InputGroup fullWidth className="mt-1">
              <input
                type="text"
                placeholder={"ID"}
                disabled={isDisableName}
                onChange={(text) =>
                  onChange("name", text.target.value)
                }
                value={field?.name}
              />
            </InputGroup>
          </Col>
          {field?.datatype !== "group" && field?.datatype !== "table" && (
            <>
              {field?.datatype === "selectMachine" && (
                <Col breakPoint={{ md: 12 }} className="mb-2">
                  <LabelIcon
                    iconName="options-2-outline"
                    title={`${intl.formatMessage({
                      id: "model.machine",
                    })} (${intl.formatMessage({ id: "optional" })})`}
                  />
                  <SelectModelMachine
                    idEnterprise={idEnterprise}
                    value={field?.idModel}
                    onChange={(e) => onChange("idModel", e)}
                    isMulti
                  />
                </Col>
              )}
              {field?.datatype !== "author" && (
                <Col breakPoint={{ md: 4 }}>
                <LabelIcon
                  iconName="alert-circle-outline"
                  title={`${intl.formatMessage({ id: "required" })} *`}
                />
                <Row
                  style={{ margin: 0 }}
                  className="mt-1 pl-1"
                  start="xs"
                >
                  <Checkbox
                    checked={!!field?.isRequired}
                    onChange={(choose) =>
                      onChange("isRequired", !field?.isRequired)
                    }
                    className="mr-1"
                  />
                  <TextSpan apparence="s2" hint>
                    {intl.formatMessage({ id: "field.is.required" })}
                  </TextSpan>
                </Row>
              </Col>
              )}
              {!noShowInList && (
                <Col breakPoint={{ md: 4 }}>
                  <LabelIcon
                    iconName="list-outline"
                    title={`${intl.formatMessage({ id: "display" })}`}
                  />
                  <Row
                    style={{ margin: 0 }}
                    className="mt-1 pl-1"
                    start="xs"
                  >
                    <Checkbox
                      className="mr-1"
                      checked={!!field?.isShowInList}
                      onChange={(choose) =>
                        onChange("isShowInList", !field?.isShowInList)
                      }
                    />
                    <TextSpan apparence="s2" hint>
                      {intl.formatMessage({ id: "show.in.list" })}?
                    </TextSpan>

                  </Row>
                </Col>
              )}
            </>
          )}
          <Col breakPoint={{ md: 4 }}>
            <LabelIcon
              iconName="eye-outline"
              title={`${intl.formatMessage({
                id: "visible.placeholder",
              })} *`}
            />
            <Row style={{ margin: 0 }}
              className="mt-1 pl-1"
              start="xs" >
              <Checkbox
                className="mr-1"
                checked={!!field?.isVisiblePublic}
                onChange={(choose) =>
                  onChange("isVisiblePublic", !field?.isVisiblePublic)
                }
              />
              <TextSpan apparence="s2" hint>
                {intl.formatMessage({ id: "public" })}?
              </TextSpan>
            </Row>
          </Col>
          {(field?.datatype === "number" && table) && (
            <Col breakPoint={{ md: 4 }}>
              <LabelIcon
                iconName="alert-circle-outline"
                title={`${intl.formatMessage({ id: "required" })} *`}
              />
              <Row
                style={{ margin: 0 }}
                className="mt-1 pl-1"
                start="xs"
              >
                <Checkbox
                  className="mr-1"
                  checked={field?.sum}
                  onChange={(e) => onChange("sum", !field?.sum)}
                />
                <TextSpan apparence="s2" hint>
                  {intl.formatMessage({ id: "sum" })}
                </TextSpan>
              </Row>
            </Col>
          )}
          {!field.isVisiblePublic && (
            <Col breakPoint={{ md: 12 }} className="mt-2 mb-4">
              <LabelIcon
                iconName="people-outline"
                title={`${intl.formatMessage({ id: "user.can.view" })} *`}
              />
              <div style={{ marginTop: 2 }}></div>
              <SelectUsers
                onChange={(value) => onChange("usersVisible", value)}
                value={field?.usersVisible}
                idEnterprise={idEnterprise}
                isMulti
              />
            </Col>
          )}

          <FormType
            type={field?.datatype}
            data={field}
            onChange={onChange}
            allFields={allFields}
            idEnterprise={idEnterprise}
          />
        </Row>
      </Col>
    </>
  );
};

export default ItemField;
