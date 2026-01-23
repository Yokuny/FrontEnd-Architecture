import { Button } from "@paljs/ui/Button";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import { EvaIcon } from "@paljs/ui/Icon";
import Row from "@paljs/ui/Row";
import React, { useEffect, useState, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { nanoid } from "nanoid";
import { connect } from "react-redux";
import { useSearchParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Fetch, TextSpan } from "../../../components";
import Pagination from "../../../components/ListPaginated/Pagination";
import Sizenation from "../../../components/ListPaginated/Sizenation";
import {
  TABLE,
  TBODY,
  TH,
  THEAD,
  TRH,
} from "../../../components/Table";
import ModalRVEJustification from "./JustifyInconsistencies/ModalRVEJustification";
import LoadingRows from "../../statistics/LoadingRows";
import Filter from "./Filter";
import ModalStrategy from "./ModalStrategy";
import { HeaderContract } from "./ContractColumn";
import Inconsitences from "./Dashboard/Inconsitences";
import {
  HeaderStatusDataColumn,
} from "./Status/StatusDataColumn";
import DownloadDataFilled from "./Download/DownloadDataFilled";
import ActivitiesCMMS from "./Dashboard/ActivitiesCMMS";
import ItemRowForm from "./ItemRowForm";

const ContainerItems = styled.div`
  min-width: 120px;
  margin-right: 30px;
`;

const FilledListForms = (props) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formSelected, setFormSelected] = useState();
  const [isBlockManyOn, setIsBlockManyOn] = useState(false);
  const [listToBlock, setListToBlock] = useState([]);

  const [showJustifyRVEModal, setShowJustifyRVEModal] = useState();
  const formDataToJustify = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const idForm = searchParams.get("idForm");
  const title = searchParams.get("t");
  const action = searchParams.get("action");
  const size = searchParams.get("size");
  const currentPage = searchParams.get("page");
  const inconsistenceType = searchParams.get("inconsistenceType");

  useEffect(() => {
    if (size && currentPage) {
      handleSearch();
    } else {
      updateQueryParam([
        ["page", 1],
        ["size", 5],
        ["finishedAt","false"]
      ]);
    }
  }, [searchParams]);

  useEffect(() => {
    if (action) {
      setFormSelected({
        idForm,
      });
    }
  }, [action]);

  const updateQueryParam = (listValues, listDelete = []) => {
    const newSearchParams = new URLSearchParams(searchParams);
    for (const item of listValues || []) {
      newSearchParams.set(item[0], item[1]);
    }
    for (const item of listDelete || []) {
      newSearchParams.delete(item);
    }
    if (listValues.length || listDelete.length) {
      setSearchParams(newSearchParams);
    }
  };

  const changeSize = (value) => {
    updateQueryParam([
      ["page", 1],
      ["size", value?.value],
    ]);
  };

  const changePage = ({ currentPage }) => {
    updateQueryParam([["page", currentPage]]);
  };

  const onCloseForm = (isNeedReload = false) => {
    setFormSelected(undefined);
    if (isNeedReload) {
      handleSearch();
    }
  };



  const onCloseJustificationModal = () => {
    setShowJustifyRVEModal(false);
    handleSearch();
  };

  const onDeleteSuccess = (id) => {
    setData((prevState) => ({
      ...prevState,
      data: prevState?.data?.filter((x) => x.id !== id),
    }));
  };



  const hasPermissionFill = props.items?.some(
    (x) => x === "/edit-fill-form-board"
  );

  const hasPermissionAdd =
    props.items?.some((x) => x === "/fill-form-board") &&
    data?.appliedPermissions?.canFill;

  const hasPermissionToDelete = data?.appliedPermissions?.canDeleteFormBoard;
  const hasPermissionToBlock = data?.appliedPermissions?.canBlock;
  const hasPermissionToEdit = data?.blocked
    ? hasPermissionToBlock && data?.appliedPermissions?.canEditFilling
    : data?.appliedPermissions?.canEditFilling;

  function handleSearch() {
    const filter = [];

    const machines = searchParams.get("machines");
    const initialDate = searchParams.get("initialDate");
    const finalDate = searchParams.get("finalDate");
    const stockType = searchParams.get("stockType");
    const codigoOperacional = searchParams.get("codigoOperacional");
    const osCodeJobId = searchParams.get("osCodeJobId");
    const status = searchParams.get("status");
    const tipoManutencao = searchParams.get("tipoManutencao");
    const finishedAt = searchParams.get("finishedAt");
    const equipmentCritical = searchParams.get("equipmentCritical");


    if (machines) {
      filter.push(`machines=${machines}`);
    }

    if (initialDate) {
      filter.push(`dateStart=${new Date(initialDate).toISOString()}`);
    }

    if (finalDate) {
      filter.push(`dateEnd=${new Date(finalDate).toISOString()}`);
    }

    if (inconsistenceType) {
      filter.push(`inconsistenceType=${inconsistenceType}`);
    }

    if (stockType) {
      filter.push(`stockType=${stockType}`);
    }

    if (codigoOperacional) {
      filter.push(`codigoOperacional=${codigoOperacional}`);
    }

    if (status) {
      filter.push(`status=${status}`);
    }

    if (tipoManutencao) {
      filter.push(`tipoManutencao=${tipoManutencao}`);
    }

    if (finishedAt) {
      filter.push(`finishedAt=${finishedAt}`);
    }

    if (osCodeJobId) {
      filter.push(`osCodeJobId=${osCodeJobId}`);
    }

    if (equipmentCritical) {
      filter.push(`equipmentCritical=${equipmentCritical}`);
    }


    filter.push(`page=${currentPage - 1}`);
    filter.push(`size=${size}`);

    const isCMMSRoute = location.pathname === "/filled-form-CMMS";
    
    if (!idForm && !isCMMSRoute) {
      return;
    }

    setIsLoading(true);
    const queryParams = [];
    
    if (idForm && idForm !== "undefined") {
      queryParams.push(`idForm=${idForm}`);
    } else if (isCMMSRoute) {
      queryParams.push("firstForm=CMMS");
    }
    
    if (filter.length > 0) {
      queryParams.push(filter.join("&"));
    }

    Fetch.get(`/formdata/filledlist?${queryParams.join("&")}`)
      .then((response) => {
        const responseData = response.data ? response.data : [];
        
        if (responseData.idForm || responseData.title) {
          updateQueryParam([
            ["idForm", responseData.idForm],
            ["t", responseData.title]
          ]);
        }
        
        setData(responseData);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  const onFilterInconsitences = (key) => {
    if (inconsistenceType?.includes(key)) {
      updateQueryParam([
        [
          "inconsistenceType",
          (inconsistenceType || "")
            .split(",")
            .filter((x) => x !== key && x)
            .join(","),
        ],
      ]);
    } else {
      updateQueryParam([
        [
          "inconsistenceType",
          [...(inconsistenceType || "").split(","), key]
            .filter((x) => x)
            .join(","),
        ],
      ]);
    }
  };

  const onFilterCMMS = (value, type) => {
    const statusParam = searchParams.get("status");
    const tipoManutencaoParam = searchParams.get("tipoManutencao");

    if (type === 'status') {
      if (statusParam === value) {
        updateQueryParam([], ["status"]);
      } else {
        updateQueryParam([["status", value]]);
      }
    } else if (type === 'tipoManutencao') {
      if (tipoManutencaoParam === value) {
        updateQueryParam([], ["tipoManutencao"]);
      } else {
        updateQueryParam([["tipoManutencao", value]]);
      }
    }
  };

  const onOpenRVEJustificationModal = (itemData) => {
    formDataToJustify.current = {
      formDataId: itemData.id,
      formId: idForm,
    };
    setShowJustifyRVEModal(true);
  };

  const onHandleSetToBlock = (itemData) => {
    const isItemInList = listToBlock.some((x) => x.id === itemData.id);
    setListToBlock((prevState) =>
      isItemInList
        ? prevState.filter((x) => x !== itemData.id)
        : [...prevState, itemData.id]
    );
  };

  const onCancelBlock = () => {
    setListToBlock([]);
    setIsBlockManyOn(false);
  }

  const onHandleSaveBlocks = () => {
    if (!listToBlock?.length) {
      return;
    }

    setIsLoading(true);
    Fetch.put(`/formdata/blockmany`, {
      idForm,
      ids: listToBlock,
    })
      .then(() => {
        setListToBlock([]);
        setIsBlockManyOn(false);
        setTimeout(() => {
          handleSearch();
        }, 1000);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  const totalItems = data?.pageInfo?.count || 0;
  const hasMoreThanMinOptions = totalItems > 10;

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Row className="m-0" between="xs">
                <TextSpan apparence="s1">{title}</TextSpan>
                <div className="flex-between">
                  {hasPermissionAdd && !isBlockManyOn && (
                    <Button
                      size="Tiny"
                      className="flex-between"
                      onClick={() =>
                        setFormSelected({
                          idForm,
                        })
                      }
                    >
                      <EvaIcon className="mr-1" name="edit-outline" />
                      <FormattedMessage id="add.form" />
                    </Button>
                  )}
                </div>
              </Row>
              {["RVE", "POLL", "RDO", "CMMS","NOON_REPORT"].includes(data?.typeForm) && (
                <Filter
                handleSearch={handleSearch} />
              )}
            </CardHeader>
            {data?.typeForm === "CMMS" && (
              <ActivitiesCMMS
                idForm={idForm}
                onFilter={onFilterCMMS}
              />
            )}
            <CardBody className="m-0">
              {data?.typeForm === "RVE" && (
                <Inconsitences
                  idForm={idForm}
                  onFilter={onFilterInconsitences}
                />
              )}

              {isLoading ? (
                <>
                  <TABLE>
                    <TBODY>
                      <LoadingRows />
                    </TBODY>
                  </TABLE>
                </>
              ) : (
                <TABLE>
                  <THEAD>
                    <TRH>
                      {isBlockManyOn && (
                        <TH textAlign="center" style={{ width: 50 }}>
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="block" />
                          </TextSpan>
                        </TH>
                      )}
                      {data?.columns?.map((x, i) => (
                        <TH textAlign="center" key={`col-Zw-${i}`}>
                          <TextSpan apparence="p2" hint>
                            {x.description}
                            {!!x.properties?.unit && (
                              <>
                                <br />
                                <TextSpan apparence="p2">
                                  ({x.properties.unit})
                                </TextSpan>
                              </>
                            )}
                          </TextSpan>
                        </TH>
                      ))}
                      <HeaderContract data={data} />
                      <HeaderStatusDataColumn data={data} />

                      {data?.typeForm === "RDO" && (
                        <TH textAlign="center">
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="stock" />
                          </TextSpan>
                        </TH>
                      )}
                      {data?.typeForm !== "CMMS" && (
                        <>
                          <TH textAlign="center">
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="user.fill" />
                            </TextSpan>
                          </TH>
                          <TH textAlign="center">
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="fill.at" />
                            </TextSpan>
                          </TH>
                        </>
                      )}
                      {data?.typeForm === "RVE" && (
                        <TH textAlign="center">
                          <TextSpan apparence="p2" hint>
                            <FormattedMessage id="consumption" />
                          </TextSpan>
                        </TH>
                      )}
                      {(hasPermissionFill || hasPermissionToDelete || hasPermissionAdd || hasPermissionToEdit) && (
                        <TH textAlign="center" style={{ width: 70 }}>
                          <TextSpan apparence="s2" hint>
                            <FormattedMessage id="actions" />
                          </TextSpan>
                        </TH>
                      )}
                    </TRH>
                  </THEAD>
                  <TBODY>
                    {data?.data?.map((itemData, i) => (
                      <ItemRowForm
                        key={`item-${i}-${itemData.id}`}
                        itemData={itemData}
                        data={data}
                        onDeleteSuccess={onDeleteSuccess}
                        onOpenRVEJustificationModal={
                          onOpenRVEJustificationModal
                        }
                        setFormSelected={setFormSelected}
                        index={i}
                        idForm={idForm}
                        setIsLoading={setIsLoading}
                        title={title}
                        isBlockManyOn={isBlockManyOn}
                        onSetToBlock={onHandleSetToBlock}
                        listToBlock={listToBlock}
                      />
                    ))}
                  </TBODY>
                </TABLE>
              )}
            </CardBody>
            <CardFooter>
              <Row className="pl-1 pr-1" between="xs">
                <Col breakPoint={{ md: 4 }}>
                  <Row className="m-0">
                    {!isBlockManyOn && !isLoading && !!data?.data?.length && (
                      <DownloadDataFilled
                        totalItems={totalItems}
                        isFormRVE={data?.typeForm === "RVE"}
                      />
                    )}

                    {["RDO", "Sondagem"].includes(data?.typeForm) && hasPermissionToBlock && !isLoading &&
                      (isBlockManyOn ? (
                        <>
                          <Button
                            size="Tiny"
                            status="Basic"
                            className="flex-between ml-2"
                            onClick={() => onHandleSaveBlocks()}
                            disabled={!listToBlock?.length}
                          >
                            <EvaIcon className="mr-1" name="checkmark-outline" />
                            <FormattedMessage id="save.block" />
                          </Button>
                          <Button
                            size="Tiny"
                            status="Danger"
                            appearance="ghost"
                            className="flex-between ml-2"
                            onClick={() => onCancelBlock()}
                          >
                            <EvaIcon className="mr-1" name="close-outline" />
                            <FormattedMessage id="cancel" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="Tiny"
                          status="Warning"
                          appearance="ghost"
                          className="flex-between ml-2"
                          onClick={() => setIsBlockManyOn(true)}
                        >
                          <EvaIcon name="lock-outline" />
                          <FormattedMessage id="block.many" />
                        </Button>
                      ))}
                  </Row>
                </Col>
                <Col breakPoint={{ md: 8 }}>
                  {!isLoading && <Row end="xs">
                    {hasMoreThanMinOptions && !!size && (
                      <ContainerItems>
                        <Sizenation
                          key={nanoid(4)}
                          total={totalItems}
                          value={Number(size)}
                          onChange={changeSize}
                        />
                      </ContainerItems>
                    )}
                    {!!size && !!totalItems && (
                      <Pagination
                        key={nanoid(4)}
                        totalRecords={totalItems}
                        pageLimit={Number(size)}
                        pageNeighbours={1}
                        onPageChanged={changePage}
                        currentPage={Number(currentPage)}
                      />
                    )}
                  </Row>}
                </Col>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      {!!formSelected && (
        <ModalStrategy
          idForm={idForm}
          formSelected={formSelected}
          isShow={!!formSelected}
          onClose={onCloseForm}
          title={title}
          isRVE={data?.typeForm === "RVE"}
        />
      )}

      {data?.typeForm === "RVE" && (
        <ModalRVEJustification
          show={showJustifyRVEModal}
          onClose={onCloseJustificationModal}
          data={formDataToJustify}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(FilledListForms);
