import * as React from "react";
import { Card, CardBody, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { useSearchParams } from "react-router-dom";
import { EvaIcon } from "@paljs/ui";
import { toast } from "react-toastify";
import moment from "moment";
import { isObject } from "underscore";
import {
  Fetch,
  LabelIcon,
  SpinnerFull,
  TextSpan,
  ModalAddFasService,
  ModalRavitec,
} from "../../../components";
import LoadingRows from "../../statistics/LoadingRows";
import RefusalReasonField from "../../../components/Fas/RefusalReasonField";
import {
  TABLE,
  TBODY,
  TD,
  TH,
  THEAD,
  TR,
  TRH,
} from "../../../components/Table";
import StatusFas from "./StatusFas";
import { ContextMenu } from "@paljs/ui";
import { Link } from "react-router-dom";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import { InputGroup } from "@paljs/ui/Input";
import { useReactToPrint } from "react-to-print";
import FilledListFasPdfExport from "../../../components/Fas/FilledListFasPdfExport";
import {
  canEditOS,
  canEditFAS,
  disableAddService,
  canEditRating,
} from "../../../components/Fas/Utils/FasPermissions";
import { preUploadAttachments } from "../../../components/Fas/Utils/Attachments";
import BackButton from "../../../components/Button/BackButton";
import { FasSpanOrderDescriptionTable } from "./components/FasSpanOrderDescriptionTable";
import SelectStatusOS from "../../../components/Fas/SelectStatusOS";
import { useNavigate } from "react-router-dom";
import { isRegularizationHeader } from "../../../components/Fas/Utils/Types";
import OverlayExportFas from "../../../components/Fas/OverlayExportFas";
import FasHeader from "./header/FasHeader";

const ExportPdfComponent = React.forwardRef((props, ref) => (
  <FilledListFasPdfExport forwardedRef={ref} {...props} />
));

const FilledListFas = (props) => {
  const [searchParams] = useSearchParams();
  const fasId = searchParams.get("id");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || null;

  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const [modalAddOrder, setShowModalAddOrder] = React.useState(false);
  const [editFields, setEditFields] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [toUpdateFields, setToUpdateFields] = React.useState({});
  const [isFilter, setIsFilter] = React.useState(false);
  const [filteredOrders, setFilteredOrders] = React.useState([]);
  const [dataFilter, setDataFilter] = React.useState({
    text: search ? search : "",
    status: status ? status.split(",") : [],
  });
  const [cancelOrderReasonField, setCancelOrderReasonField] =
    React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("");
  const [showRavitecModal, setShowRavitecModal] = React.useState(false);
  const [enterpriseLogo, setEnterpriseLogo] = React.useState("");
  const pdfBodyRef = React.useRef();
  const intl = useIntl();
  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0]?.id
    : null;

  React.useEffect(() => {
    if (props.isReady && props.enterprises?.length) {
      getData();
      updateFilteredOrders();
      const enterprise = props.enterprises[0];
      const logoUrl = enterprise?.image?.url || "";
      setEnterpriseLogo(logoUrl);
    }
  }, [props.enterprises, props.isReady]);

  const updateFilteredOrders = (orders) => {
    if (!isFilter) setFilteredOrders(orders);

    const filteredOrders = orders?.filter((order) => {
      return Object.values(order).some((value) => {
        if (!value || typeof value === "boolean") return false;
        let loweredValue = "";
        if (isObject(value)) {
          if (value.razao) {
            loweredValue = value.razao.toLowerCase();
          } else {
            return false;
          }
        } else if (typeof value === "string") {
          loweredValue = value.toLowerCase();
        }
        return (
          (dataFilter.text
            ? loweredValue?.includes(dataFilter.text?.toLowerCase())
            : true) &&
          (!!dataFilter.status?.length
            ? dataFilter.status.includes(order.state)
            : true)
        );
      });
    });
    setFilteredOrders(filteredOrders);
  };

  const onBack = () => {
    navigate(-1);
  };

  const onCancelDeleteFas = () => {
    setCancelOrderReasonField(false);
    setCancelReason("");
  };

  const handlePrint = useReactToPrint({
    content: () => pdfBodyRef.current,
    onAfterPrint: () => {
      setIsLoading(false);
    },
  });

  const getRowContextItems = (id, order) => {
    const contextMenuItems = [
      {
        icon: "eye-outline",
        title: intl.formatMessage({ id: "view" }),
        link: { to: `/filled-os?id=${id}` },
      },
    ];

    if (canEditOS(data, order, props.items)) {
      contextMenuItems.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit" }),
        link: { to: `/filled-os?id=${id}&edit=true` },
      });
    }

    if (
      props.items.includes("/fas-remove") &&
      [
        "not.realized",
        "not.approved",
        "awaiting.create.confirm",
        "awaiting.request",
        "supplier.canceled",
        "awaiting.collaborators",
        "awaiting.rating",
      ].includes(order.state) &&
      !isRegularizationHeader(data.type)
    ) {
      contextMenuItems.push({
        icon: "flip-2-outline",
        title: intl.formatMessage({ id: "transfer.service" }),
        link: { to: `/filled-os?id=${id}&transfer=true` },
      });
    }

    if (
      props.items.includes("/fas-add-qsms") &&
      ["supplier.canceled"].includes(order.state)
    ) {
      contextMenuItems.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit.recommended.supplier" }),
        link: { to: `/filled-os?id=${id}&edit-rec-sup=true` },
      });
    }

    if (canEditRating(order)) {
      contextMenuItems.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit.rating" }),
        link: { to: `/fas-add-rating?id=${id}&not-realized=true` },
      });
    }

    return contextMenuItems;
  };

  const onDeleteFas = async () => {
    try {
      if (!cancelReason) {
        toast.error(intl.formatMessage({ id: "reason.required" }));
        return;
      }

      setIsLoading(true);
      await Fetch.post(`/fas/cancel-item`, {
        id: fasId,
        item: "fas",
        cancelReason: cancelReason,
      });
      setIsLoading(false);
      toast.success(intl.formatMessage({ id: "cancelled.succesfully" }));
      onBack();
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getMinServiceDate = () => {
    if (isRegularizationHeader(data.type)) {
      return;
    }
    return new Date();
    // if (data.type === "Normal") {
    //   return today.setDate(today.getDate() + 7);
    // }
    // else {
    //   return today;
    // }
  };

  const checkForFasOnSameDateShipPair = async (date, idVessel, type) => {
    if (isRegularizationHeader(type)) {
      return false;
    }
    const justDate = moment(date).format("YYYY-MM-DD");
    const response = await Fetch.get(`/fas/exists-validation?dateOnly=${justDate}&idVessel=${idVessel}&timezone=${moment().format("Z")}&type=${type}&notId=${fasId}`);
    return !!response.data?.fasExists;
  };

  const showNewOrderRow = () => {
    setShowModalAddOrder(true);
  };

  const showEditFields = () => {
    setToUpdateFields({
      serviceDate: data.serviceDate,
      local: data.local,
    });
    setEditFields(true);
  };

  const onChangeFilter = (prop, value) => {
    setDataFilter((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const saveEditedFields = async () => {
    try {
      if (!fasId) {
        return;
      }

      setIsLoading(true);

      const dateOnly = moment(toUpdateFields.serviceDate).format("YYYY-MM-DD");
      const hasFasOnSameDateShipPair = await checkForFasOnSameDateShipPair(
        dateOnly,
        data.vessel?.id,
        data.type
      );

      if (hasFasOnSameDateShipPair) {
        toast.error(intl.formatMessage({ id: "fas.same.day.ship.exists" }));
        setIsLoading(false);
        return;
      }

      await Fetch.post(`/fas/edit-fas`, { id: fasId, ...toUpdateFields })
        .then((response) => {
          toast.success(intl.formatMessage({ id: "save.successfull" }));
          setEditFields(false);
          setIsLoading(false);
          getData();
        })
        .catch(() => {
          toast.error(intl.formatMessage({ id: "error.save" }));
          setIsLoading(false);
        });
    } catch {
      toast.error(intl.formatMessage({ id: "error.save" }));
      setIsLoading(false);
    }
  };

  const addNewOrder = async (order) => {
    let returnOrder = false;
    try {
      if (!fasId) {
        return returnOrder;
      }
      setIsLoading(true);
      order.name = order.name?.slice(-1) === "/" ? order.name?.slice(0, -1) : order.name;
      if (order.files) {
        // If there are attachements to this order, pre-uploads them
        order.files = await preUploadAttachments({
          files: order.files,
          intl,
          supplierCanView: order.supplierCanView,
        });
      } else {
        order.files = [];
      }
      const response = await Fetch.post(`/fas/add-fas-order`, {
        id: fasId,
        orders: [order],
      });
      if (response.status === 200) {
        toast.success(intl.formatMessage({ id: "service.added" }));
        returnOrder = true;
      }
    } catch (e) {
      toast.error(intl.formatMessage({ id: "service.add.error" }));
      returnOrder = false;
    } finally {
      setIsLoading(false);
    }
    return returnOrder;
  };

  const getData = async () => {
    if (!fasId) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await Fetch.get(`/fas/find?id=${fasId}&idEnterprise=${idEnterprise}`);
      const ordersWithIndex =
        response.data?.orders
          ?.sort((a, b) => a?.name?.localeCompare(b?.name))
          ?.map((order, index) => ({
            ...order,
            index: `${index + 1}`,
          })) || [];

      // Fetch FAS events
      const eventsResponse = await Fetch.get(`/fas/fas-events/find?id=${fasId}`);

      setData(
        response.data
          ? {
              ...response.data,
              orders: ordersWithIndex,
              events: eventsResponse.data || [],
            }
          : []
      );
      if (status || search) {
        setDataFilter({
          text: search,
          status: status?.split(",") || [],
        });
        setIsFilter(true);
      }
      updateFilteredOrders(ordersWithIndex);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const exportFas = async () => {
    setIsLoading(true);
    setTimeout(() => {
      handlePrint();
    }, 1000);
  };

  const exportFasCsv = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URI_BASE}/fas/export-fas-csv?id=${data.id}&idEnterprise=${idEnterprise}`,
        {
          method: "GET",
          headers: {
            token: localStorage.getItem("token"),
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      if (!response.ok) {
        setIsLoading(false);
        toast.error(intl.formatMessage({ id: "error.export" }));
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilter = () => {
    setDataFilter({
      text: "",
      status: [],
    });
    setIsFilter(false);
    setFilteredOrders(data.orders);
  };

  const onCloseModalEdit = async (refresh = false) => {
    setShowModalAddOrder(false);
    if (refresh) {
      await getData();
    }
  };

  const getSupplier = (order) => {
    let supplierDisplay = "N/A";
    const isNonSupplierState = [
      "supplier.canceled",
      "not.realized",
      "awaiting.create.confirm",
      "awaiting.request"
    ].includes(order.state);

    if (!isNonSupplierState && !order?.supplierData?.cancelled && order?.supplierData?.razao) {
      supplierDisplay = order?.supplierData?.razao;
    } else if (order.recommendedSupplier) {
      supplierDisplay = `${order.recommendedSupplier} (Sugerido)`;
    }

    return supplierDisplay;
  };


  return (
    <React.Fragment>
      <Card>
        <FasHeader
          onBack={onBack}
          data={data}
          fasId={fasId}
          getData={saveEditedFields}
          canEditFAS={canEditFAS(data, props.items, editFields)}
          showEditFields={(shouldEdit) => {
            if (shouldEdit === false) {
              setEditFields(false);
            } else {
              showEditFields();
            }
          }}
          editFields={editFields}
          canRemoveFAS={props.items.includes("/fas-remove")}
          onDeleteConfirmation={() => setCancelOrderReasonField(true)}
        />
        <CardBody>
          <Row>
            <Col breakPoint={{ md: 12, lg: 12 }}>
              {cancelOrderReasonField && (
                <>
                  <RefusalReasonField
                    onChange={(reason) => setCancelReason(reason)}
                    onRefuse={onDeleteFas}
                    onCancel={onCancelDeleteFas}
                    delete={true}
                  />
                </>
              )}
            </Col>
            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
              <LabelIcon title={<FormattedMessage id="enterprise" />} />
              <TextSpan apparence="s1" className="pl-1">
                {data.enterprise?.name}
              </TextSpan>
            </Col>
            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
              <LabelIcon title={<FormattedMessage id="vessel" />} />
              <TextSpan apparence="s1" className="pl-1">
                {data.vessel?.name}
              </TextSpan>
            </Col>
            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
              <LabelIcon title={<FormattedMessage id="type" />} />
              <TextSpan apparence="s1" className="pl-1">
                {data.type}
              </TextSpan>
            </Col>

            <Col
              breakPoint={editFields ? { lg: 4, md: 4 } : { lg: 3, md: 3 }}
              className="mb-4"
            >
              <LabelIcon title={<FormattedMessage id="service.date" />} />

              {editFields ? (
                <InputDateTime
                  onChange={(e) =>
                    setToUpdateFields({
                      ...toUpdateFields,
                      serviceDate: moment(e).format("YYYY-MM-DDTHH:mm:ssZ"),
                    })
                  }
                  value={toUpdateFields.serviceDate}
                  min={getMinServiceDate()}
                />
              ) : (
                <TextSpan apparence="s1" className="pl-1">
                  {data?.serviceDate
                    ? moment(data.serviceDate).format("DD MMM YYYY HH:mm:ss")
                    : "-"}
                </TextSpan>
              )}
            </Col>

            <Col breakPoint={{ lg: 9, md: 9 }} className="mb-4">
              <LabelIcon title={<FormattedMessage id="local" />} />
              {editFields ? (
                <InputGroup fullWidth>
                  <input
                    type="text"
                    value={toUpdateFields.local}
                    placeholder={intl.formatMessage({
                      id: "local",
                    })}
                    onChange={(value) =>
                      setToUpdateFields({
                        ...toUpdateFields,
                        local: value.target.value,
                      })
                    }
                  />
                </InputGroup>
              ) : (
                <TextSpan apparence="s1" className="pl-1">
                  {data.local}
                </TextSpan>
              )}
            </Col>

            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
              <LabelIcon title={<FormattedMessage id="event.team.change" />} />
              <TextSpan apparence="s1" className="pl-1">
                {data.teamChange !== undefined && data.teamChange !== null && data.teamChange !== ""
                  ? (data.teamChange ? intl.formatMessage({ id: "yes" })
                    : intl.formatMessage({ id: "no" })) : "-"}
              </TextSpan>
            </Col>

            {data?.orders?.length ? (
              isLoading ? (
                <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
                  <LabelIcon title={<FormattedMessage id="order.service" />} />
                  <TABLE>
                    <TBODY>
                      <LoadingRows />
                    </TBODY>
                  </TABLE>
                </Col>
              ) : (
                <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
                  <LabelIcon title={<FormattedMessage id="search" />} />
                  <Row className="m-0">
                    <Col breakPoint={{ md: 6, xs: 12 }} className="mb-2">
                      <InputGroup fullWidth className="mt-1">
                        <input
                          placeholder={intl.formatMessage({
                            id: "search.placeholder",
                          })}
                          type="text"
                          onChange={(e) =>
                            onChangeFilter("text", e.target.value)
                          }
                          disabled={isLoading}
                          readOnly={isLoading}
                          value={dataFilter.text}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 4, xs: 12 }} className="mb-2">
                      <div className="mt-1"></div>
                      <SelectStatusOS
                        value={dataFilter.status}
                        onChange={(value) =>
                          onChangeFilter(
                            "status",
                            value?.map((x) => x.value)
                          )
                        }
                      />
                    </Col>
                    <Col breakPoint={{ md: 2, xs: 12 }} className="mb-2">
                      <Row className="m-0" center="xs" middle="xs">
                        <Button
                          size="Tiny"
                          className={`flex-between ${!isFilter ? "mt-1" : ""}`}
                          status={isFilter ? "Info" : "Basic"}
                          onClick={() => {
                            setIsFilter(true);
                            updateFilteredOrders(data.orders);
                          }}
                        >
                          <EvaIcon className="mr-1" name="search-outline" />
                          <FormattedMessage id="filter" />
                        </Button>
                        {isFilter && (
                          <Button
                            size="Tiny"
                            className="flex-between mt-2"
                            appearance="ghost"
                            status="Danger"
                            onClick={clearFilter}
                          >
                            <EvaIcon className="mr-1" name="close-outline" />
                            <FormattedMessage id="clear.filter" />
                          </Button>
                        )}
                      </Row>
                    </Col>
                  </Row>
                  <LabelIcon title={<FormattedMessage id="order.service" />} />
                  <TABLE>
                    <THEAD>
                      <TRH>
                        <TH>
                          <TextSpan apparence="p2" hint>
                            N°
                          </TextSpan>
                        </TH>
                        <TH textAlign="center" key={`col-Zw-1`}>
                          <TextSpan apparence="p2" hint>
                            JOB
                          </TextSpan>
                        </TH>
                        <TH textAlign="center" key={`col-Zw-1`}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="os" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="center" key={`col-Zw-1`}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="description" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="center" key={`col-Zw-1`}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="materialFas.label" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="center" key={`col-Zw-1`}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="onboardMaterialFas.label" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="center" key={`col-Zw-1`}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="rmrbFas.label" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="center" key={`col-Zw-1`}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="suppliers" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="center" key={`col-Zw-1`}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="status" />
                          </TextSpan>
                        </TH>
                      </TRH>
                    </THEAD>
                    <TBODY>
                      {filteredOrders?.map(({ id, ...order }, i) => (
                        <TR key={i} isEvenColor={i % 2 === 0}>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.index}</TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.job}</TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.name}</TextSpan>
                          </TD>
                          <TD textAlign="left">
                            <FasSpanOrderDescriptionTable
                              text={order.description}
                            />
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">
                              {order.materialFas}
                            </TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">
                              {order.onboardMaterial}
                            </TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.rmrb}</TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">
                              {getSupplier(order)}
                            </TextSpan>
                          </TD>
                          <TD
                            textAlign="center"
                            style={{ width: 60, padding: 11 }}
                          >
                            <StatusFas status={order.state} />
                          </TD>
                          <TD style={{ maxWidth: "90px" }}>
                            {!editFields && (
                              <ContextMenu
                                className="inline-block mr-1 text-start"
                                placement="left"
                                items={getRowContextItems(id, order)}
                                Link={Link}
                              >
                                <Button size="Tiny" status="Basic">
                                  <EvaIcon name="more-vertical" />
                                </Button>
                              </ContextMenu>
                            )}
                          </TD>
                        </TR>
                      ))}
                    </TBODY>
                  </TABLE>
                </Col>
              )
            ) : (
              <></>
            )}
          </Row>
          <ModalAddFasService
            show={modalAddOrder}
            items={props.items}
            setIsLoading={setIsLoading}
            addedOrders={[]}
            enterprise={data?.enterprise?.id}
            onClose={onCloseModalEdit}
            onAdd={addNewOrder}
            headerData={{
              type: data.type,
              vesselCode: data.vessel?.name?.toUpperCase()?.replace("CBO", "")?.replaceAll(" ", "").slice(0, 3)
            }}
            requestOrderField={isRegularizationHeader(data.type)}
          />
          <ExportPdfComponent fowardedRef={pdfBodyRef} data={data} />
        </CardBody>
        <CardFooter>
          <Row className="m-0" between="xs" middle="xs">
            <Row className="m-0">
              {filteredOrders?.length > 4 && <BackButton onClick={onBack} />}
              <OverlayExportFas
                exportFasPdf={exportFas}
                exportFasCsv={exportFasCsv}
              />
              {props.items.includes("/fas-add-qsms") && (
                <Button
                  className="flex-between ml-4"
                  size="Tiny"
                  status="Primary"
                  appearance="ghost"
                  onClick={() => setShowRavitecModal(true)}>
                  <EvaIcon name="file-text-outline" className="mr-1" />
                  RAVITEC
                </Button>
              )}
            </Row>
            <Row className="m-0">
              {editFields ? (
                <>
                  <Button
                    size="Tiny"
                    className="flex-between mr-4"
                    status="Danger"
                    appearance="ghost"
                    onClick={() => setEditFields(false)}
                  >
                    <EvaIcon name="close-outline" className="mr-1" />
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button
                    size="Tiny"
                    className="flex-between mr-2"
                    status="Success"
                    onClick={() => saveEditedFields()}
                  >
                    <EvaIcon name="checkmark-outline" className="mr-1" />
                    <FormattedMessage id="save" />
                  </Button>
                </>
              ) : (
                <></>
              )}
              {props?.items.includes("/fas-new") && !editFields ? (
                <>
                  <Button
                    size="Tiny"
                    status="Primary"
                    className="flex-between"
                    onClick={showNewOrderRow}
                    disabled={disableAddService({
                      type: data.type,
                      serviceDate: data.serviceDate,
                    })}
                  >
                    <EvaIcon name="plus-square-outline" className="mr-1" />
                    <FormattedMessage id="add.service" />
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Row>
          </Row>
        </CardFooter>
      </Card>
      <ModalRavitec
        show={showRavitecModal}
        onClose={() => setShowRavitecModal(false)}
        fasData={data}
        orders={data.orders || []}
        enterpriseLogo={enterpriseLogo}
      />
      <SpinnerFull isLoading={isLoading} />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(FilledListFas);
