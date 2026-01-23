import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  EvaIcon,
  Row,
  Tooltip,
} from "@paljs/ui";
import moment from "moment";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  DeleteConfirmation,
  Fetch,
  Modal,
  TextSpan,
} from "../../../components";
import {
  TABLE,
  TBODY,
  TD,
  TH,
  THEAD,
  TR,
  TRH,
} from "../../../components/Table";
import { floatToStringExtendDot } from "../../../components/Utils";
import DowntimeForm from "./DowntimeForm";
import Filter from "./Filter";
import ListFiles from "./ListFiles";
import LoadingRows from "./LoadingRows";
import StatusOperation from "./StatusOperation";
import IndicatorsChart from "./IndicatorsChart";
import Total from "./Total";
import Profit from "./Profit";
import DownloadDataCSV from "./DownloadDataCSV";
import { getPtax, sumOthers } from "./Utils";
import ViewForm from "../Filled/ViewForm";
import { getFields } from "./FieldsForms";
import { OPERATIONAL } from "../../../components/Select/SelectView";

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListDowntime = (props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isShowViewModal, setIsShowViewModal] = useState(undefined);
  const [selectedItem, setSelectedItem] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState(OPERATIONAL);
  const [dataSuperSet, setSuperSet] = useState({
    data: [],
    group: [],
    ptaxList: [],
  });

  const intl = useIntl();

  const [searchParams, setSearchParams] = useSearchParams();

  const hasPermission = props.items.some((item) => item === "/downtime-form");

  const idEnterprise = props.enterprises?.length ? props.enterprises[0].id : "";

  const initialDate = searchParams.get("initialDate") || "";
  const finalDate = searchParams.get("finalDate") || "";
  const machines = searchParams.get("machines") || "";
  const status = searchParams.get("status") || "";

  useEffect(() => {
    if (!props.isReady) return;

    let idEnterprise = props.enterprises?.length ? props.enterprises[0].id : "";
    if (!idEnterprise) {
      idEnterprise = localStorage.getItem("id_enterprise_filter");
    }

    if (idEnterprise) {
      getDataInitialAsync({
        idEnterprise,
        machines: machines?.split(","),
        initialDate,
        finalDate,
      });
    }
  }, [props.isReady, props.enterprises]);

  const getDataInitialAsync = async (filter) => {
    setIsLoading(true);
    try {
      const responseData = await getDataAsync(filter);
      const responseGroup = await getGroupAsync(filter.idEnterprise);
      const responsePtax = await getDataPtaxAsync(filter.idEnterprise);
      setSuperSet({
        data: responseData.data,
        group: responseGroup.data,
        ptaxList: responsePtax.data
          ?.map((x) => ({ ...x, date: new Date(x.date) }))
          ?.sort((a, b) => b.date - a.date),
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getDataPtaxAsync = async (idEnterprise) => {
    return Fetch.get(`/ptax?idEnterprise=${idEnterprise}`);
  };

  const getDataAsync = (filter) => {
    const query = [`idEnterprise=${filter.idEnterprise}`];
    if (filter.initialDate) query.push(`initialDate=${filter.initialDate}`);
    if (filter.finalDate) query.push(`finalDate=${filter.finalDate}`);
    if (filter.machines?.filter((x) => !!x)?.length) {
      query.push(
        `machines=${filter.machines
          .filter((x) => !!x)
          .map((value) => value)
          .join(",")}`
      );
    }
    if (filter.status) query.push(`status=${filter.status}`);

    return Fetch.get(`/assetstatus?${query.join("&")}`);
  };

  const handleEdit = (id) => {
    setIsOpenModal(true);
    setSelectedItem(dataSuperSet?.data?.find((item) => item.id === id));
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await Fetch.delete(`assetstatus/${id}`);
      setSuperSet((prevState) => ({
        ...prevState,
        data: prevState?.data?.filter((item) => item.id !== id),
      }));
      toast.success(intl.formatMessage({ id: "delete.success" }));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleNew = () => {
    setIsOpenModal(true);
    setSelectedItem({});
  };

  const handleCloseModal = async ({ isNeedReload = false }) => {
    setIsOpenModal(false);
    setSelectedItem({});

    if (!isNeedReload) {
      return;
    }

    setIsLoading(true);
    try {
      const filter = {
        idEnterprise,
        initialDate,
        finalDate,
        machines: machines?.split(","),
        status,
      };
      const response = await getDataAsync(filter);

      setSuperSet((prevState) => ({
        ...prevState,
        data: response.data,
      }));
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.get" }));
    }
    setIsLoading(false);
  };

  const getGroupAsync = (idEnterprise) => {
    return Fetch.get(`/assetstatus/group/enterprise/${idEnterprise}`);
  };

  const handleSearch = async (filter) => {
    try {
      setIsLoading(true);
      const responseData = await getDataAsync(filter);
      setSuperSet((prevState) => ({
        ...prevState,
        data: responseData.data,
      }));
      const updateQuery = [];
      const removeQuery = [];
      if (filter.initialDate)
        updateQuery.push(["initialDate", filter.initialDate]);
      else removeQuery.push("initialDate");

      if (filter.finalDate) updateQuery.push(["finalDate", filter.finalDate]);
      else removeQuery.push("finalDate");

      if (filter.machines?.length)
        updateQuery.push([
          "machines",
          filter.machines.map((value) => value).join(","),
        ]);
      else removeQuery.push("machines");

      if (filter.status) updateQuery.push(["status", filter.status]);
      else removeQuery.push("status");

      if (updateQuery?.length || removeQuery?.length)
        updateQueryParam(updateQuery, removeQuery);
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.get" }));
    } finally {
      setIsLoading(false);
    }
  };

  const updateQueryParam = (listValues, listDelete = []) => {
    const newSearchParams = new URLSearchParams(searchParams);
    for (const item of listValues || []) {
      newSearchParams.set(item[0], item[1]);
    }
    for (const item of listDelete || []) {
      newSearchParams.delete(item);
    }
    if (listValues?.length || listDelete?.length) {
      setSearchParams(newSearchParams);
    }
  };

  const getDetailsMountData = () => {
    const dataFiltered = dataSuperSet?.data?.find(
      (x) => x.id === isShowViewModal
    );
    return {
      embarcacao: dataFiltered?.idMachine,
      typeAsset: dataFiltered?.contract?.typeAsset,
      enterpriseName: dataFiltered?.contract?.enterprise,
      customer: dataFiltered?.contract?.customer,
      price: dataFiltered?.contract?.price,
      priceFormatted: dataFiltered?.contract
        ? `${floatToStringExtendDot(dataFiltered?.contract?.price, 2)} USD`
        : "",
      status: dataFiltered?.status,
      inicio: dataFiltered?.startedAtOriginal,
      fim: dataFiltered?.endedAtOriginal,
      grupo: dataFiltered?.group,
      idContract: dataFiltered?.idContract,
      subgrupo: dataFiltered?.subgroup,
      evento: dataFiltered?.event,
      local: dataFiltered?.local,
      observacao: dataFiltered?.observation,
      description: dataFiltered?.description,
      carta: dataFiltered?.letter,
      recebido: dataFiltered?.consumption?.received,
      fornecido: dataFiltered?.consumption?.provided,
      consumido: `${floatToStringExtendDot(
        dataFiltered?.consumption?.consumed,
        3
      )} m3`,
      estoqueInicial: dataFiltered?.consumption?.stock?.initial,
      estoqueFinal: dataFiltered?.consumption?.stock?.final,
      volume: dataFiltered?.consumption?.volume,
      consumptionPrice: dataFiltered?.consumption?.price,
      id: dataFiltered?.id,
      _id: dataFiltered?._id,
      value: 0,
      otherDescription: "",
      factor: dataFiltered?.factor,
      consumptionTotal: `${floatToStringExtendDot(
        dataFiltered?.consumption?.volume * dataFiltered?.consumption?.price,
        2
      )} R$`,
      others: dataFiltered?.others?.map((x) => ({
        ...x,
        otherDescription: x.description,
      })),
    };
  };

  const hasPermissionViewFinancial =
    props.items?.some((x) => x === "/view-inoperability-profit-loss") || false;

  const showFiles = !!dataSuperSet?.data?.some((x) => x?.files?.length);

  return (
    <>
      <Card>
        <CardHeader>
          <Row middle="xs" between="xs" className="m-0">
            <TextSpan apparence="s1">
              <FormattedMessage id="operability" />
            </TextSpan>
            {hasPermission && (
              <Button size="Tiny" className="flex-between" onClick={handleNew}>
                <EvaIcon name="plus-outline" className="mr-2" />
                <FormattedMessage id="new" />
              </Button>
            )}
          </Row>
        </CardHeader>

        <CardBody>
          <Filter
            idEnterprise={idEnterprise}
            dataInitial={{
              initialDate,
              finalDate,
              machines,
              status,
            }}
            onSearchCallback={handleSearch}
            view={view}
            setView={setView}
          />
          {!!dataSuperSet?.data?.length && !isLoading && (
            <>
              <IndicatorsChart data={dataSuperSet?.data} view={view} />
              <Row className="m-0 pb-2" end="md">
                <DownloadDataCSV
                  data={dataSuperSet?.data}
                  ptaxList={dataSuperSet?.ptaxList}
                  hasPermissionViewFinancial={hasPermissionViewFinancial}
                />
              </Row>
            </>
          )}
          <TABLE>
            <THEAD>
              <TRH>
                <TH>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="vessel" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="status" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="date.start" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="date.end" />
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="hour.unity" />
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="day.unity" />
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="consumption" />
                  </TextSpan>
                </TH>
                {hasPermissionViewFinancial && (
                  <>
                    <TH textAlign="end">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="others" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="end">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="revenue" />
                      </TextSpan>
                    </TH>
                  </>
                )}
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="letter" />
                  </TextSpan>
                </TH>
                {showFiles && (
                  <>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="files" />
                      </TextSpan>
                    </TH>
                  </>
                )}
                {hasPermissionViewFinancial && (
                  <TH textAlign="center">
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="total" />
                    </TextSpan>
                  </TH>
                )}
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="filled.user" />
                  </TextSpan>
                </TH>
                {hasPermission && (
                  <TH textAlign="center">
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="actions" />
                    </TextSpan>
                  </TH>
                )}
              </TRH>
            </THEAD>

            <TBODY>
              {isLoading ? (
                <LoadingRows />
              ) : (
                dataSuperSet?.data
                  ?.filter((x) => x.status !== "operacao")
                  ?.map((item, i) => {
                    const ptax = hasPermissionViewFinancial
                      ? getPtax(
                        dataSuperSet?.ptaxList,
                        item.startedAt || new Date()
                      )
                      : 0;

                    const diffInMinutes =
                      item.endedAt && item.startedAt
                        ? (new Date(item.endedAt).getTime() -
                          new Date(item.startedAt).getTime()) /
                        3600000
                        : 0;

                    return (
                      <TR key={nanoid(5)} isEvenColor={i % 2 === 0}>
                        <TD>
                          <TextSpan apparence="s2">
                            {item.machine.name}
                          </TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <StatusOperation status={item.status} />
                        </TD>
                        <TD textAlign="center">
                          {item.startedAt ? (
                            <Col>
                              <TextSpan apparence="p2">
                                {moment(item.startedAt).format("DD MMM")}
                              </TextSpan>
                              <TextSpan apparence="s2">
                                {moment(item.startedAt).format("HH:mm")}
                              </TextSpan>
                            </Col>
                          ) : (
                            <TextSpan apparence="s2">-</TextSpan>
                          )}
                        </TD>
                        <TD textAlign="center">
                          {item.endedAt ? (
                            <Col>
                              <TextSpan apparence="p2">
                                {moment(item.endedAt).format("DD MMM")}
                              </TextSpan>
                              <TextSpan apparence="s2">
                                {moment(item.endedAt).format("HH:mm")}
                              </TextSpan>
                            </Col>
                          ) : (
                            <TextSpan apparence="s2">-</TextSpan>
                          )}
                        </TD>
                        <TD textAlign="end">
                          {item.status === "downtime-parcial" ? (
                            <>
                              <Col>
                                <Tooltip
                                  eventListener="#scrollPlacementId"
                                  className="inline-block"
                                  trigger="hint"
                                  placement={"top"}
                                  content={
                                    <>
                                      <Col>
                                        <TextSpan apparence="p2">
                                          Total:{" "}
                                          <strong>
                                            {floatToStringExtendDot(
                                              diffInMinutes,
                                              2
                                            )}
                                          </strong>
                                        </TextSpan>
                                        <TextSpan apparence="p2">
                                          Fator: <strong>{item.factor}%</strong>
                                        </TextSpan>
                                      </Col>
                                    </>
                                  }
                                >
                                  <TextSpan apparence="p2">
                                    {floatToStringExtendDot(
                                      diffInMinutes *
                                      ((item.factor || 100) / 100),
                                      2
                                    )}
                                  </TextSpan>
                                </Tooltip>
                              </Col>
                            </>
                          ) : (
                            <>
                              {!!diffInMinutes ? (
                                <Col>
                                  <TextSpan apparence="p2">
                                    {floatToStringExtendDot(diffInMinutes, 2)}
                                  </TextSpan>
                                </Col>
                              ) : (
                                <TextSpan apparence="s2">-</TextSpan>
                              )}
                            </>
                          )}
                        </TD>
                        <TD textAlign="end">
                          {item.status === "downtime-parcial" ? (
                            <>
                              <Col>
                                <Tooltip
                                  eventListener="#scrollPlacementId"
                                  className="inline-block"
                                  trigger="hint"
                                  placement={"top"}
                                  content={
                                    <>
                                      <Col>
                                        <TextSpan apparence="p2">
                                          Total:{" "}
                                          <strong>
                                            {floatToStringExtendDot(
                                              diffInMinutes / 24,
                                              3
                                            )}
                                          </strong>
                                        </TextSpan>
                                        <TextSpan apparence="p2">
                                          Fator: <strong>{item.factor}%</strong>
                                        </TextSpan>
                                      </Col>
                                    </>
                                  }
                                >
                                  <TextSpan apparence="p2">
                                    {floatToStringExtendDot(
                                      (diffInMinutes / 24) *
                                      ((item.factor || 100) / 100),
                                      3
                                    )}
                                  </TextSpan>
                                </Tooltip>
                              </Col>
                            </>
                          ) : (
                            <>
                              {!!diffInMinutes ? (
                                <TextSpan apparence="p2">
                                  {floatToStringExtendDot(
                                    diffInMinutes / 24,
                                    3
                                  )}
                                </TextSpan>
                              ) : (
                                <TextSpan apparence="s2">-</TextSpan>
                              )}
                            </>
                          )}
                        </TD>
                        <TD textAlign="end">
                          {hasPermissionViewFinancial &&
                            item?.consumption?.price ? (
                            <Col>
                              <TextSpan apparence="p3">
                                {floatToStringExtendDot(
                                  item?.consumption?.volume,
                                  3
                                )}
                                <TextSpan apparence="p3" className="ml-1" hint>
                                  L
                                </TextSpan>
                              </TextSpan>
                              <TextSpan apparence="s2">
                                {floatToStringExtendDot(
                                  item?.consumption?.volume *
                                  item?.consumption?.price,
                                  2
                                )}
                                <TextSpan apparence="p3" className="ml-1" hint>
                                  R$
                                </TextSpan>
                              </TextSpan>
                            </Col>
                          ) : (
                            <TextSpan apparence="p2">
                              {floatToStringExtendDot(
                                item?.consumption?.consumed ||
                                item?.consumption?.volume,
                                2
                              )}
                            </TextSpan>
                          )}
                        </TD>
                        {hasPermissionViewFinancial && (
                          <>
                            <TD textAlign="end">
                              {item?.others?.length ? (
                                <TextSpan apparence="s2">
                                  {floatToStringExtendDot(
                                    sumOthers(item, ptax),
                                    2
                                  )}
                                  <TextSpan
                                    apparence="p3"
                                    className="ml-1"
                                    hint
                                  >
                                    R$
                                  </TextSpan>
                                </TextSpan>
                              ) : (
                                <TextSpan apparence="s2">-</TextSpan>
                              )}
                            </TD>
                            <TD textAlign="end">
                              <Profit item={item} ptax={ptax} />
                            </TD>
                          </>
                        )}
                        <TD textAlign="center">
                          {/*  */}
                          <TextSpan apparence="s2">{item?.letter}</TextSpan>
                        </TD>
                        {showFiles && (
                          <TD textAlign="center">
                            {item?.files?.length ? (
                              <ListFiles files={item.files} />
                            ) : null}
                          </TD>
                        )}
                        {hasPermissionViewFinancial && (
                          <TD textAlign="end">
                            <Total item={item} ptax={ptax} />
                          </TD>
                        )}
                        <TD textAlign="center">
                          <TextSpan apparence="p2">{item.user?.name}</TextSpan>
                        </TD>
                        {hasPermission && (
                          <TD>
                            <Row
                              middle="xs"
                              center="xs"
                              className="m-0"
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "nowrap",
                              }}
                            >
                              <Button
                                size="Tiny"
                                status="Basic"
                                className="ml-1"
                                style={{ padding: 1 }}
                                onClick={() =>
                                  window.open(`/print-operability?id=${item.id}`)
                                }
                              >
                                <EvaIcon name="printer-outline" />
                              </Button>

                              <Button
                                size="Tiny"
                                status="Info"
                                className="ml-3"
                                style={{ padding: 1 }}
                                onClick={() => setIsShowViewModal(item.id)}
                              >
                                <EvaIcon name="eye-outline" />
                              </Button>

                              <Button
                                size="Tiny"
                                status="Basic"
                                className="ml-3"
                                style={{ padding: 1 }}
                                onClick={() => handleEdit(item.id)}
                              >
                                <EvaIcon name="edit-2-outline" />
                              </Button>

                              <DeleteConfirmation
                                onConfirmation={() => handleDelete(item.id)}
                                message={intl.formatMessage({
                                  id: "delete.message.default",
                                })}
                              >
                                <Button
                                  size="Tiny"
                                  status="Danger"
                                  appearance="ghost"
                                  style={{ padding: 1 }}
                                  className="ml-2"
                                >
                                  <EvaIcon name="trash-2-outline" />
                                </Button>
                              </DeleteConfirmation>
                            </Row>
                          </TD>
                        )}
                      </TR>
                    );
                  })
              )}
            </TBODY>
          </TABLE>
        </CardBody>
      </Card>

      <Modal
        title={intl.formatMessage({ id: "operability" })}
        show={isOpenModal}
        onClose={handleCloseModal}
        hideOnBlur={true}
        size="ExtraLarge"
        styleContent={{
          overflowX: "hidden",
          maxHeight: "70vh",
          width: "100%",
          margin: "0 auto",
          padding: 0,
        }}
        renderFooter={() => (
          <CardFooter style={{ textAlign: "right" }}>
            <Button type="submit" form="form" size="Small">
              <FormattedMessage id="save" />
            </Button>
          </CardFooter>
        )}
      >
        {!!idEnterprise && (
          <DowntimeForm
            onClose={handleCloseModal}
            data={selectedItem}
            group={dataSuperSet?.group}
            idEnterprise={idEnterprise}
            hasPermissionViewFinancial={hasPermissionViewFinancial}
          />
        )}
      </Modal>

      {!!isShowViewModal && (
        <Modal
          show={isShowViewModal}
          size="ExtraLarge"
          styleContent={{ maxHeight: "calc(100vh - 250px)" }}
          onClose={() => setIsShowViewModal(undefined)}
          title={"details"}
          renderFooter={() => (
            <CardFooter>
              <Button
                size="Tiny"
                appearance="ghost"
                status="Info"
                className="ml-1 flex-between"
                onClick={() =>
                  window.open(`/print-operability?id=${isShowViewModal}`)
                }
              >
                <EvaIcon name="printer-outline" className="mr-1" />
                <FormattedMessage id="print" />
              </Button>
            </CardFooter>
          )}
        >
          <ViewForm
            fields={getFields({
              eventsRef: { current: [] },
              group: dataSuperSet.group,
              data: {},
              status: "",
              hasPermissionViewFinancial,
            })}
            values={{ data: getDetailsMountData() }}
          />
        </Modal>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(ListDowntime);
