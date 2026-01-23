import { nanoid } from "nanoid";
import { FormattedMessage } from "react-intl";
import { Button, EvaIcon, Row, Tooltip } from "@paljs/ui";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";
import { TBODY, TD, TR } from "../../../../components/Table";
import { TextSpan } from "../../../../components";
import StatusFas from "../StatusFas";
import LoadingRows from "./LoadingRows";
import { useTheme } from "styled-components";

const Img = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
`;

const TBODYStyled = styled(TBODY)`
  tr {
    cursor: pointer;
  }
`;

export const BodyTable = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isLoading, data } = props;

  const getQueryArray = () => {
    const query = !!props.query.length ? props.query : [];
    if (props.search) query.push(`search=${props.search}`);

    return query;
  };

  const clickOpenFas = (item) => {
    const query = getQueryArray();
    navigate(
      `/filled-fas?id=${item.id}${query.length ? `&${query.join("&")}` : ""}`
    );
  };

  const clickOpenOs = (order) => {
    if (!order?.id) return;
    navigate(`/filled-os?id=${order.id}`);
  };

  const mountCode = (item) => {
    return `${item.type?.slice(0, 1)}-${item.vessel?.name
      ?.toUpperCase()
      ?.replace("CBO", "")
      ?.replaceAll(" ", "")
      .slice(0, 3)} ${moment(item.serviceDate).format("YYYYMMDD")}`;
  };

  const getLighthouseColor = (order) => {
    switch (order.slaLighthouse) {
      case 1:
        return theme.colorSuccess500;
      case 2:
        return theme.colorWarning500;
      case 3:
        return theme.colorDanger500;
      default:
        return theme.colorPrimary200;
    }
  };

  const getOrderSupplier = (order) => {
    if (!!Object.keys(order?.supplierData ?? {}).length && !order?.supplierData?.cancelled) {
      return order?.supplierData?.razao 
    }

    return order?.recommendedSupplier ? 
      `${order?.recommendedSupplier} (Sugerido)`:
      "N/A";
  }

  const renderFas = (fas) => {
    return (
      <>
        <Row
          className="m-0 pl-4 pt-2 pb-2"
          middle="xs"
          style={{ display: "flex", flexWrap: "nowrap" }}
        >
          {fas?.vessel?.image?.url ? (
            <Img src={fas?.vessel?.image?.url} alt={fas?.vessel?.name} />
          ) : (
            <div style={{ minHeight: 50 }} />
          )}
          <div className="ml-2">
            <TextSpan apparence="s2">
              {fas?.vessel?.name} / {fas.type} /{" "}
              {fas.serviceDate
                ? moment(fas.serviceDate).format("DD MMM YYYY")
                : "-"}
            </TextSpan>
            <br />
            <TextSpan apparence="p2" hint>
              {mountCode(fas)}
            </TextSpan>
          </div>
        </Row>
      </>
    );
  };

  return (
    <>
      <TBODYStyled>
        {isLoading ? (
          <LoadingRows key={nanoid(5)} />
        ) : (
          <>
            {data?.data?.map((fas, indexFas) => {
              return (fas?.orders?.length ? fas?.orders : [{ empty0: true }])
                ?.sort((a, b) => a?.name?.localeCompare(b?.name))
                ?.map((order, indexOrder) => {
                  return (
                    <TR
                      isEvenColor={indexOrder % 2 === 0}
                      isEvenBorder={
                        indexOrder ===
                        (order?.empty0 ? 1 : fas?.orders?.length) - 1
                          ? false
                          : true
                      }
                      key={nanoid(5)}
                    >
                      {indexOrder === 0 && (
                        <>
                          <TD
                            rowspan={order?.empty0 ? 1 : fas?.orders?.length}
                            onClick={() => clickOpenFas(fas)}
                          >
                            {renderFas(fas)}
                          </TD>
                          <TD
                            rowspan={order?.empty0 ? 1 : fas?.orders?.length}
                            onClick={() => clickOpenFas(fas)}
                          >
                            <Tooltip
                              placement="top"
                              content={"Visualizar FAS"}
                              trigger="hint"
                            >
                              <Button
                                size="Tiny"
                                style={{ padding: 3 }}
                                className="ml-3"
                                onClick={() => clickOpenFas(fas)}
                                status="Basic"
                              >
                                <EvaIcon name="book-open-outline" />
                              </Button>
                            </Tooltip>
                          </TD>
                        </>
                      )}
                      <TD textAlign="start">
                        {order?.empty0 ? (
                          <TextSpan apparence="p2" hint className="pl-2">
                            <FormattedMessage id="os.empty" />
                          </TextSpan>
                        ) : (
                          <TextSpan apparence="p2" className="pl-2">
                            {order?.name}
                          </TextSpan>
                        )}
                      </TD>
                      <TD>
                        <div className="p-2 mr-2">
                          <StatusFas
                            styleText={{
                              fontSize: "0.64rem",
                              lineHeight: "0.98rem",
                              textAlign: "center",
                            }}
                            status={order?.state}
                          />
                        </div>
                      </TD>
                      <TD textAlign="start">
                        <TextSpan
                          apparence={
                            !Object.keys(order?.supplierData ?? {}).length
                              ? "p3"
                              : "p2"
                          }
                          hint={!Object.keys(order?.supplierData ?? {}).length}
                        >
                          {getOrderSupplier(order)}
                        </TextSpan>
                      </TD>
                      <TD textAlign="start">
                        <TextSpan apparence="p2" hint>
                          {order?.supplierData?.addedBy}
                        </TextSpan>
                      </TD>
                      <TD textAlign="center" style={{ width: 70 }}>
                        <Row className="m-0" center="xs">
                          <div
                            style={{
                              display: "flex",
                              width: "12px",
                              height: "12px",
                              backgroundColor: getLighthouseColor(order),
                              borderRadius: "50%",
                            }}
                          />
                        </Row>
                      </TD>
                      <TD textAlign="center" style={{ width: 70 }}>
                        <Row className="m-0" center="xs">
                          {!order.empty0 && (
                            <Tooltip
                              placement="top"
                              content={"Abrir OS"}
                              trigger="hint"
                            >
                              <Button
                                size="Tiny"
                                style={{ padding: 4 }}
                                onClick={() => clickOpenOs(order)}
                                status="Basic"
                              >
                                <EvaIcon name="eye-outline" />
                              </Button>
                            </Tooltip>
                          )}
                        </Row>
                      </TD>
                    </TR>
                  );
                });
            })}
          </>
        )}
      </TBODYStyled>
    </>
  );
};
