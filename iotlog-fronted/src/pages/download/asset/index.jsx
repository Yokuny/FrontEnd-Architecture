import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  EvaIcon,
  Row,
} from "@paljs/ui";
import moment from "moment";
import { nanoid } from "nanoid";
import { useEffect, useState, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  DeleteConfirmation,
  Fetch,
  Modal,
  SpinnerFull,
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
import ReportForm from "./ReportForm";
import { connect } from "react-redux";

function DownloadRequestAsset(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const loaded = useRef(false);

  const intl = useIntl();

  const hasPermission = props.items?.some((x) => x === "/download-data-asset-request");

  useEffect(() => {
    if (props.isReady) {
      const idEnterpise = props.enterprises?.length
        ? props.enterprises[0].id
        : "";
      getData(idEnterpise);
    }
  }, [props.isReady, props.enterprises]);

  useEffect(() => {
    if (loaded.current && props.listNew?.some(x => x.title?.toLowerCase()?.includes("arquivo pronto"))) {
      const idEnterpise = props.enterprises?.length
      ? props.enterprises[0].id
      : "";
      getData(idEnterpise);
    }

  }, [props.listNew]);

  function handleModal() {
    setShowModal(!showModal);
  }

  function getData(idEnterpise) {
    if (!loaded.current) {
      setIsLoading(true);
    }

    const idEnterprise = idEnterpise || localStorage.getItem("id_enterprise_filter");

    Fetch.get("download-queue?idEnterprise=" + idEnterprise)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
        loaded.current = true;
      })
      .catch(() => {
        setIsLoading(false);
        loaded.current = true;
      });
  }

  function normalizeStatus(status) {
    switch (status) {
      case "ready":
        return "Success";
      case "processing":
        return "Warning";
      case "error":
        return "Danger";
      case "empty":
        return "Danger";
      case "expired":
        return "Danger";
      default:
        return "Basic";
    }
  }

  function normalizeInterval(interval) {
    const MINUTE_IN_MILLISECONDS = 60000;

    if (interval < MINUTE_IN_MILLISECONDS) {
      return moment(interval).format("ss") + " s";
    }

    return moment(interval) / MINUTE_IN_MILLISECONDS + " min";
  }

  function handleDelete(id) {
    setIsLoading(true);

    Fetch.delete("download-queue/" + id)
      .then(() => {
        getData();
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  function handleSave(data) {
    setIsLoading(true);

    Fetch
      .post("/download-queue", data)
      .then(() => {
        handleModal();
        getData();
      })
      .catch(() => {
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <Modal
        size="Large"
        show={showModal}
        onClose={handleModal}
        title={intl.formatMessage({ id: "generate.report" })}
        hideOnBlur={true}
        styleContent={{ overflowX: "hidden" }}
        renderFooter={() => (
          <CardFooter style={{ textAlign: "right" }}>
            <Button type="submit" form="form" size="Small">
              <FormattedMessage id="save" />
            </Button>
          </CardFooter>
        )}
      >
        <ReportForm
          idEnterprise={props.enterprises?.length
            ? props.enterprises[0].id
            : localStorage.getItem("id_enterprise_filter")}
          handleSave={handleSave} />
      </Modal>

      <Card>
        <CardHeader>
          <Row middle="xs" between="xs" className="m-0">

            <TextSpan apparence="s1">
              <FormattedMessage id="download" />
            </TextSpan>

            {hasPermission && (
              <Button size="Tiny" className="flex-between" onClick={handleModal}>
                <EvaIcon name="plus-outline" className="mr-2" />
                <FormattedMessage id="new" />
              </Button>
            )}
          </Row>
        </CardHeader>

        <CardBody>
          <TABLE>
            <THEAD>
              <TRH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="status" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="machine" />
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
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="interval" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="requested.by" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="created.at" />
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="days.remaining" />
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
              {data?.map((item, i) => {
                return (
                  <TR key={nanoid(5)} isEvenColor={i % 2 === 0}>
                    <TD
                      textAlign="center"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Badge
                        status={normalizeStatus(item.status)}
                        appearance="filled"
                        style={{ position: "relative" }}
                      >
                        {intl.formatMessage({ id: item.status || "unknown" })}
                      </Badge>
                    </TD>
                    <TD textAlign="center">
                      <TextSpan apparence="s2">
                        {item.machines?.map((machine) => machine.name).join(", ")}
                      </TextSpan>
                    </TD>
                    <TD textAlign="center">
                      <TextSpan apparence="s2">
                        {item.dateStart
                          ? moment(item.dateStart).format("DD MMM, HH:mm")
                          : "-"}
                      </TextSpan>
                    </TD>
                    <TD textAlign="center">
                      <TextSpan apparence="s2">
                        {item.dateEnd
                          ? moment(item.dateEnd).format("DD MMM, HH:mm")
                          : "-"}
                      </TextSpan>
                    </TD>
                    <TD textAlign="center">
                      <TextSpan apparence="s2">
                        {item.interval ? normalizeInterval(item.interval) : "-"}
                      </TextSpan>
                    </TD>
                    <TD textAlign="center">
                      <TextSpan apparence="p2">{item.user?.name || ""}</TextSpan>
                    </TD>
                    <TD textAlign="center">
                      <TextSpan apparence="p2">
                        {moment(item.createdAt).format("DD MMM, HH:mm")}
                      </TextSpan>
                    </TD>
                    <TD textAlign="center">
                      <TextSpan apparence="p2">
                        {moment(
                          moment(item.createdAt).add(30, "d") -
                          moment(new Date())
                        ).format("DD")}
                      </TextSpan>
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
                            onClick={() => {
                              window.open(item.file);
                            }}
                            disabled={
                              item.file && item.status === "ready" ? false : true
                            }
                          >
                            <EvaIcon name="download-outline" />
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
                              className="ml-3"
                            >
                              <EvaIcon name="trash-2-outline" />
                            </Button>
                          </DeleteConfirmation>
                        </Row>
                      </TD>
                    )}
                  </TR>
                );
              })}
            </TBODY>
          </TABLE>
        </CardBody>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  listNew: state.notification.listNew,
});

export default connect(mapStateToProps, undefined)(DownloadRequestAsset);
