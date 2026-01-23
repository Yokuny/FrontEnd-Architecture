import * as React from "react";
import styled from "styled-components";
import { InputGroup } from "@paljs/ui/Input";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Checkbox, EvaIcon, Select } from "@paljs/ui";
import {
  SelectEnterprise,
  SelectMachineEnterprise,
  Fetch,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import { toast } from "react-toastify";
import { Button } from "@paljs/ui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingRows from "../../statistics/LoadingRows";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from '../../../components/Table';
import InputDateTime from "../../../components/Inputs/InputDateTime";
import moment from "moment";
import SelectFasType from "../../../components/Select/SelectFasType";
import { translate } from "../../../components/language";
import BackButton from "../../../components/Button/BackButton";
import { ModalAddFasService } from "../../../components";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { preUploadAttachments } from "../../../components/Fas/Utils/Attachments";
import { isRegularizationHeader } from "../../../components/Fas/Utils/Types";

const RowCenter = styled.div`
  display: flex;
  justify-content: center;
`
const ContainerRow = styled(Row)`
  width: 100%;

  input {
    line-height: 1.1rem;
  }

  a svg {
    top: -6px;
    position: absolute;
    right: -5px;
  }
`;

const RowFlex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
`

const NewFas = (props) => {
  const [enterprise, setEnterprise] = React.useState(undefined);
  const [idVessel, setIdVessel] = React.useState(undefined);
  const [type, setType] = React.useState("");
  const [date, setDate] = React.useState("");
  const [orders, setOrders] = React.useState([]);
  const [local, setLocal] = React.useState("");
  const [showAddOrderModal, setShowAddOrderModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTransfered, setIsTransfered] = React.useState(undefined);
  const [teamChange, setTeamChange] = React.useState({ value: false, label: 'NÃO' });

  const intl = useIntl();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();

  const vesselId = searchParams.get("vesselId");
  const orderId = searchParams.get("orderId");

  React.useEffect(() => {
    if (orderId) {
      getData(orderId)
    }

    if (vesselId) {
      getVesselData(vesselId)
    }
    setIsTransfered(!!location?.state?.transferReason);
  }, [orderId, vesselId])

  const handleVesselChange = (value) => {
    setIdVessel({
      ...value,
      code: value?.label?.toUpperCase()?.replace("CBO", "")?.replaceAll(" ", "").slice(0, 3)
    });
  }

  const onBack = () => {
    navigate(-1);
  }

  const getVesselData = (vesselId) => {
    Fetch.get(`/machine/find?id=${vesselId}`)
      .then((res) => {
        setIdVessel({
          value: res?.data?.id,
          label: res?.data?.name,
        });
      })
      .catch((e) => {
      });
  }

  const getData = (orderId) => {
    Fetch.get(`fas/find-fas-order?id=${orderId}`)
      .then((res) => {

        setOrders([
          ...orders,
          {
            ...res.data,
            ...(
              location?.state?.transferReason &&
              { newTransferReason: location?.state?.transferReason }
            )
          }])
      })
  }

  const getMinServiceDate = () => {
    if (isRegularizationHeader(type)) {
      return;
    }
    const today = new Date();
    if (type === "Normal") {
      return today.setDate(today.getDate() + 7);
    }
    else {
      return today;
    }
  }

  const onDelete = (index) => {
    const newState = orders.filter((x, i) => i !== index);
    setOrders(newState);
  }

  const handleAddService = async (order) => {
    setOrders([...orders, order]);
    setShowAddOrderModal(false);
    return new Promise((resolve) => resolve(true));
  }

  const checkForFasOnSameDateShipPair = async (date, idVessel, type) => {
    if (isRegularizationHeader(type)) {
      return false;
    }
    const justDate = moment(date).format("YYYY-MM-DD");
    const response = await Fetch.get(`/fas/exists-validation?dateOnly=${justDate}&idVessel=${idVessel.value}&timezone=${moment().format("Z")}&type=${type}`);
    return !!response.data?.fasExists;
  }

  const handleOpenModal = async () => {
    setIsLoading(true);
    const hasFasOnSameDateShipPair = await checkForFasOnSameDateShipPair(date, idVessel, type);
    if (hasFasOnSameDateShipPair) {
      toast.error(intl.formatMessage({ id: "fas.same.day.ship.exists" }));
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setShowAddOrderModal(true);
  }

  const onSave = async () => {

    if (!enterprise) {
      toast.error(translate("enterprise.required"));
      return;
    }

    if (!idVessel) {
      toast.error(translate("vessels.required.at.least.one"));
      return;
    }

    if (!type) {
      toast.error(translate("type.required"));
      return;
    }

    if (!date) {
      toast.error(translate("date.required"));
      return;
    }

    if (!teamChange) {
      toast.error(translate("team.change.required"));
      return;
    }

    if (!local) {
      toast.error(translate("local.required"));
      return;
    }

    if (type === "Normal") {
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(minDate.getDate() + 7);
      const selectedDate = new Date(date);

      if (selectedDate < minDate) {
        toast.error(translate("fas.service.date.min.days.required"));
        return;
      }
    }

    if (orders.length === 0) {
      toast.error(translate("product.service.required"));
      return;
    }

    const ordersIsMissingFields = orders.filter((order) => {
      return !order.name
        || (order.jobRequired && !order.job)
        || !order.description
        || !order.materialFas
        || !order.onboardMaterial || !order.rmrb
        || ((order.rmrb === "Sim") && !order.rmrbCode) // Se o RMRB for Sim, o código é obrigatório
        || ((order.materialFas === "Sim") && !order.materialFasCode) // Se o materialFas for Sim, o código é obrigatório
    });

    if (ordersIsMissingFields.length > 0) {
      toast.error(translate("service.missing.fields"));
      return;
    }

    setIsLoading(true);

    const hasFasOnSameDateShipPair = await checkForFasOnSameDateShipPair(date, idVessel, type);
    if (hasFasOnSameDateShipPair) {
      toast.error(intl.formatMessage({ id: "fas.same.day.ship.exists" }));
      setIsLoading(false);
      return;
    }
    const preUploadedAttachmentsOrders = [];

    for await (const order of orders) {

      if (order.files && !orderId) {
        const preUploadedFiles = await preUploadAttachments({
          files: order.files,
          intl,
          supplierCanView: order.supplierCanView
        });
        preUploadedAttachmentsOrders.push({
          ...order,
          files: preUploadedFiles,
        });
      } else {
        preUploadedAttachmentsOrders.push({
          ...order,
          files: [],
        });
      }
    }

    const fas = {
      idEnterprise: enterprise?.value,
      idVessel: idVessel?.value,
      type: type,
      serviceDate: date,
      teamChange: teamChange.value,
      local: local,
      orders: preUploadedAttachmentsOrders.map((order) => {
        return {
          ...order,
          name: order.name?.slice(-1) === "/" ? order.name?.slice(0, -1) : order.name,
          materialFasCode: order.materialFasCode || "N/A",
          rmrbCode: order.rmrbCode || "N/A",
        }
      })
    };

    try {
      await Fetch.post("/fas/open-fas", fas);
      setIsLoading(false);
      navigate(`/fas`);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <RowFlex>
            <BackButton
              onClick={onBack} />
            <FormattedMessage id="add.fas" />
          </RowFlex>
        </CardHeader>
        <CardBody>
          <ContainerRow>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="enterprise" /> *
              </TextSpan>
              <SelectEnterprise
                onChange={(value) => setEnterprise(value)}
                value={enterprise}
                oneBlocked
              />
            </Col>
            <Col breakPoint={{ lg: 4, md: 12 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="vessel" /> *
              </TextSpan>
              <SelectMachineEnterprise
                idEnterprise={enterprise?.value}
                onChange={handleVesselChange}
                value={idVessel} />
            </Col>
            <Col breakPoint={{ lg: 4, md: 6 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="type" /> *
              </TextSpan>
              <SelectFasType
                onChange={(value) => setType(value.value)}
                isDisabled={!!orders?.length && type}
                noRegularization={ isTransfered !== undefined ? (isTransfered === true || !props?.items?.includes("/fas-regularization-order")) : undefined} />
            </Col>
            <Col breakPoint={{ lg: 4, md: 6 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="service.date" /> *
              </TextSpan>

              <InputDateTime
                min={getMinServiceDate()}
                onChange={(e) => setDate(moment(e).format('YYYY-MM-DDTHH:mm:ssZ'))}
                value={date}
              />

            </Col>
            <Col breakPoint={{ lg: 2, md: 4 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="event.team.change" /> *
              </TextSpan>

              <Select
                onChange={(e) => setTeamChange(e)}
                value={teamChange}
                options={[
                  { value: false, label: 'NÃO' },
                  { value: true, label: 'SIM' }
                ]}
                defaultValue={{ value: false, label: 'NÃO' }}
                required
              />

            </Col>
            <Col breakPoint={{ lg: 10, md: 8 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="local" /> *
              </TextSpan>
              <InputGroup fullWidth>
                <input type="text"
                  value={local}
                  placeholder={intl.formatMessage({
                    id: "local",
                  })}
                  onChange={(value) => setLocal(value.target.value)} />
              </InputGroup>
            </Col>

            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="services" />
              </TextSpan>
              {isLoading ?
                <TABLE>
                  <TBODY>
                    <LoadingRows />
                  </TBODY>
                </TABLE>
                : <TABLE>
                  <THEAD>
                    <TRH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='s2' hint>
                          JOB
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='s2' hint>
                          <FormattedMessage id="os" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='s2' hint>
                          <FormattedMessage id="description" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='s2' hint>
                          <FormattedMessage id="materialFas.label" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='s2' hint>
                          <FormattedMessage id="materialFas.code.label" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='s2' hint>
                          <FormattedMessage id="onboardMaterialFas.label" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='s2' hint>
                          <FormattedMessage id="rmrbFas.label" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='s2' hint>
                          <FormattedMessage id="rmrbFas.code.label" />
                        </TextSpan>
                      </TH>
                    </TRH>
                  </THEAD>
                  <TBODY>
                    {orders?.map((order, i) =>
                      <TR key={i} isEvenColor={i % 2 === 0}>
                        <TD textAlign="center">
                          <TextSpan apparence="s2">{order.job}</TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence="s2">{`${order.name}`}</TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence="s2">{order.description}</TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence="s2">{order.materialFas}</TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence="s2">{order.materialFasCode}</TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence="s2">{order.onboardMaterial}</TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence="s2">{order.rmrb}</TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence="s2">{order.rmrbCode}</TextSpan>
                        </TD>
                        <TD>
                          <Button
                            appearance="ghost"
                            size="Tiny"
                            status="Danger" onClick={() => onDelete(i)} >
                            <EvaIcon name="trash-2-outline" />
                          </Button>
                        </TD>
                      </TR>
                    )}
                  </TBODY>
                </TABLE>
              }

              {isTransfered &&
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="transfer.os.warning" />
                </TextSpan>
              }
              <RowCenter>
                <Button
                  size="Tiny"
                  disabled={!date || !idVessel?.value || !type}
                  status="Info"
                  className="flex-between mt-4"
                  onClick={handleOpenModal}>
                  <EvaIcon name="plus-square-outline" className="mr-1" />
                  <FormattedMessage id="add.service" />
                </Button>
              </RowCenter>
            </Col>
          </ContainerRow>
          <ModalAddFasService
            show={showAddOrderModal}
            items={props.items}
            setIsLoading={setIsLoading}
            addedOrders={orders}
            onAdd={handleAddService}
            onClose={() => setShowAddOrderModal(false)}
            headerData={{
              type,
              vesselCode: idVessel?.code
            }}
            requestOrderField={["Docagem - Regularizacao", "Regularizacao"].includes(type)}
            enterprise={enterprise?.value}
          />
        </CardBody>
        <CardFooter>
          <Row className="m-0" between={orders?.length > 4 ? "xs" : ""} end={orders?.length <= 4 ? "xs" : ""}>
            {orders?.length > 4 && <BackButton />}
            <Button size="Small" className="flex-between" onClick={onSave}>
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(NewFas);
