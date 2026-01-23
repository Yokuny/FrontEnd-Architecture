import { useState, useRef, useEffect } from "react";
import { CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { EvaIcon, Checkbox } from "@paljs/ui";
import styled, { css, useTheme } from "styled-components";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import {
  LabelIcon,
} from "../";
import { InputGroup } from "@paljs/ui/Input";
import {
  TextSpan,
  Modal,
  ColCenter,
  ListAdvancedSearchPaginated
} from "../";

const ItemRow = styled.div`
  ${({ colorTextTheme, theme }) => css`
    border-left: 6px solid ${theme[colorTextTheme]};
    padding: 1rem;
    display: flex;
    flex-direction: row;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: ${theme.backgroundBasicColor2};
      color: ${theme.colorPrimary500};
    }
  `}
`;


const ModalTransferService = ({ onAdd, onClose, show, currentFasHeader, orderId }) => {
  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedFasHeader, setSelectedFasHeader] = useState();
  const [transferReasonField, setTransferReasonField] = useState();
  const firstRun = useRef(true);

  const renderItem = ({ item, index }) => {
    return (
      <>
        <ItemRow
          key={nanoid(index)}
          disabled={item.id === currentFasHeader?.id}
          onClick={() => { if (item.id !== currentFasHeader?.id) setSelectedFasHeader(item) }}
          colorTextTheme={"colorPrimary500"}
          style={{ paddingTop: 27, paddingBottom: 27 }}>
          <ColCenter
            breakPoint={{ md: 1, xs: 12 }}
            className="mt-2 mb-2 col-center-middle"
          >
            <Checkbox
              disabled={item.id === currentFasHeader?.id}
              checked={selectedFasHeader && item?.id === selectedFasHeader?.id}
              onChange={(e) => {
                setSelectedFasHeader(item)
              }}
            />
          </ColCenter>
          <Col
            breakPoint={{ md: 1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <EvaIcon
              name={"file-outline"}
              options={{
                fill: theme.colorPrimary500,
                width: 25,
                height: 25,
                animation: { type: "pulse", infinite: false, hover: true },
              }}
            />
          </Col>
          <ColCenter breakPoint={{ md: 5 }}>

            <TextSpan apparence="s2">
              {item.vessel?.name} / {item.type} /  {item.serviceDate ? moment(item.serviceDate).format("DD MMM YYYY") : "-"}
            </TextSpan>

          </ColCenter>
        </ItemRow>
      </>
    );
  };


  useEffect(() => {
    if (firstRun) {
      firstRun.current = false
    }
  }, [])

  const handleClose = () => {
    setSelectedFasHeader();
    onClose();
  }
  const handleNewFas = () => {

    if (!transferReasonField) {
      toast.error(intl.formatMessage({
        id: "transfer.reason.required"
      }));
      return;
    }

    navigate(`/new-fas?orderId=${orderId}&vesselId=${currentFasHeader?.vessel.id}`, {
      state: {
        transferReason: transferReasonField,
        fasType: currentFasHeader.type
      }
    })
  }

  const handleSave = () => {

    if (!selectedFasHeader) {
      toast.error(intl.formatMessage({ id: "service.missing.fields" }));
      return;
    }
    onAdd(selectedFasHeader.id, transferReasonField);
    setSelectedFasHeader();
  }

  return (
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({ id: "transfer.service" })}
      onClose={handleClose}
      styleContent={{ maxHeight: "calc(100vh - 250px)" }}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            <Button size="Tiny"
              className="flex-between" onClick={handleSave}>
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
            <Button
              size="Tiny"
              className="flex-between ml-2"
              status="Basic"
              apparence="ghost"
              onClick={handleNewFas}>
              <EvaIcon name="plus-outline" className="mr-1" />
              <FormattedMessage id="new.fas" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      {currentFasHeader &&
        <ListAdvancedSearchPaginated
          renderItem={renderItem}
          contentStyle={{
            justifyContent: "space-between",
            padding: 0,
          }}
          pathUrlSearh={`/fas/list?today_gt=true&vessel=${currentFasHeader?.vessel?.id}&noRegularization=true`}
          filterEnterprise
          isFilterAdvanced={false}
        />
      }
      <LabelIcon
        title={<FormattedMessage id="reason" />}
      />
      <InputGroup fullWidth className="flex-row">
        <textarea
          type="text"
          placeholder={intl.formatMessage({
            id: "reason",
          })}
          rows={3}
          onChange={(text) => setTransferReasonField(text.target.value)}
        />
      </InputGroup>
    </Modal>
  )
}

export default ModalTransferService;
