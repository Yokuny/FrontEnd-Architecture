import {
  Button,
  Card,
  CardFooter,
  Col,
  EvaIcon,
  Row,
} from "@paljs/ui";
import React from "react";
import styled, { css } from "styled-components";
import {
  Modal,
  TextSpan,
} from "../../../../components";
import { useOptions } from "./useOptions";
import { FormattedMessage } from "react-intl";
import ItemField from "./ItemField";
import { generateCodeFieldName } from "../Utils";

const CardNoShadow = styled(Card)`
  box-shadow: none;
  margin-bottom: 1.3rem;

  ${({ theme }) => css`
    border: 1px solid ${theme.borderBasicColor3};
    `}
`

const ItemViewField = (props) => {

  const {
    field,
    handleSave,
    onRemove,
    level,
    allFields,
    idEnterprise,
    noShowInList = false,
    table = false,
  } = props;


  const [isShowModal, setIsShowModal] = React.useState(false);
  const [dataModal, setDataModal] = React.useState(null);

  const { optionsType } = useOptions({ level });

  const typeProps = optionsType.find((item) => item.value === field?.datatype);

  const isDisableName = !!field?.name;

  const onHandleEdit = () => {
    setDataModal(field);
    setIsShowModal(true);
  }

  const onChange = (prop, value) => {
    setDataModal(prevState => ({
      ...prevState,
      [prop]: value,
      ...(prop === "description" && !isDisableName
        ? { name: generateCodeFieldName(value) }
        : {})
    }));
  }

  const onSave = () => {
    handleSave(dataModal);
    setIsShowModal(false);
    setDataModal(null);
  }

  const onCloseModal = () => {
    setIsShowModal(false);
  }

  return (
    <>
      <CardNoShadow className="mb-3">
        <Row middle="xs" className="pt-2 pb-2">
          <Col
            breakPoint={{ md: 1, xs: 1 }}
            style={{ cursor: "pointer" }}
          >
            <Row center="xs">
              <EvaIcon
                options={{ height: 20, width: 20, fill: "#cdcdcd" }}
                name="flip-outline"
                status="Control"
              />
            </Row>
          </Col>
          <Col breakPoint={{ md: 3, xs: 3 }}>
            <Row center="xs">
              <TextSpan apparence="label"
                style={{
                  fontSize: ".6rem",
                  textTransform: "Uppercase",
                  color: typeProps?.color,
                  backgroundColor: `${typeProps?.color}10`,
                  padding: ".05rem .5rem",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                {typeProps?.label}
              </TextSpan>
            </Row>
          </Col>
          <Col breakPoint={{ md: 6, xs: 6 }} style={{ display: "flex", flexDirection: "column" }}>
            <TextSpan apparence="s2">
              {field?.description}
            </TextSpan>
            {field.fields?.map(x =>
              <TextSpan apparence="s2" hint className="ml-1">
                {x?.description}
              </TextSpan>)
            }
          </Col>
          <Col
            breakPoint={{ md: 2, xs: 2 }}
            style={{ cursor: "pointer" }}
          >
            <Row center="xs" middle="xs" className="m-0">
              <Button
                status="Basic"
                onClick={onHandleEdit}
                size="Tiny"
                appearance="ghost"
                className="mr-2"
              >
                <EvaIcon name={"edit-2-outline"} />
              </Button>
              <Button
                status="Danger"
                onClick={onRemove}
                size="Tiny"
                appearance="ghost"
              >
                <EvaIcon name={"trash-2-outline"} />
              </Button>
            </Row>
          </Col>
        </Row>
        {isShowModal && <Modal
          show={isShowModal}
          onClose={() => onCloseModal()}
          textTitle={
            <>
              <TextSpan apparence="s1" >
                <FormattedMessage
                  id="edit"
                /> - {dataModal?.description}
              </TextSpan>
            </>
          }
          size={level === 2 ? "Large" : "ExtraLarge"}
          styleContent={{
            maxHeight: "calc(100vh - 150px)"
          }}
          renderFooter={() => (
            <CardFooter>
              <Row className="m-0" end="xs">
                <Button
                  status="Primary"
                  onClick={() => onSave()}
                  size="Small"
                  disabled={!dataModal?.description
                    || !dataModal?.datatype
                    || !dataModal?.name
                  }
                >
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          )}
        >
          <ItemField
            key={dataModal?.id}
            field={dataModal}
            allFields={allFields}
            onChange={(prop, value) => onChange(prop, value)}
            level={level}
            table={table}
            noShowInList={noShowInList || false}
            idEnterprise={idEnterprise}
            isDisableName={isDisableName}
          />
        </Modal>}
      </CardNoShadow>
    </>
  );
};

export default ItemViewField;

