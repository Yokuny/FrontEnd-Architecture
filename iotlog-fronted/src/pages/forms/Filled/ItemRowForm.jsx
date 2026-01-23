import { Badge, Button, Checkbox, EvaIcon, Row, Tooltip } from "@paljs/ui";
import { TD, TR } from "../../../components/Table";
import { Fetch, TextSpan } from "../../../components";
import { getFormatCell } from "./Data/Utils";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { BodyContract } from "./ContractColumn";
import { BodyStatusDataColumn } from "./Status/StatusDataColumn";
import DeleteItemRow from "./DeleteItemRow";
import { useState } from "react";
import ModalViewForm from "./ModalViewForm";
import { SkeletonThemed } from "../../../components/Skeleton";
import ConsumptionButton from './ConsumptionButton';

export default function ItemRowForm({
  key,
  index,
  data,
  itemData,
  onDeleteSuccess,
  setIsLoading,
  onOpenRVEJustificationModal,
  setFormSelected,
  idForm,
  title,
  isBlockManyOn,
  onSetToBlock,
  listToBlock,
}) {

  const [formSelectedView, setFormSelectedView] = useState();
  const [isLoadingRow, setIsLoadingRow] = useState(false);
  const [internalLocked, setInternalLocked] = useState(false);

  const getStatusBadge = (item) => {
    const status = {
      warning: "Warning",
      info: "Success",
      alarm: "Danger",
    };

    return status[item] || "Info";
  };


  const getEstoqueIcons = (estoque) => {
    if (!estoque || estoque.length === 0) return null;

    const hasFornecimento = estoque.some((e) => e.tipo === "Fornecimento");
    const hasRecebimento = estoque.some((e) => e.tipo === "Recebimento");

    return (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {hasFornecimento && (
          <Tooltip
            placement="top"
            content={
              <TextSpan apparence="s2">
                <FormattedMessage id="provided" />
              </TextSpan>
            }
            trigger="hover"
          >
            <EvaIcon status="Warning" name="arrow-upward-outline" />
          </Tooltip>
        )}

        {hasRecebimento && (
          <Tooltip
            placement="top"
            content={
              <TextSpan apparence="s2">
                <FormattedMessage id="machine.supplies.consumption.received" />
              </TextSpan>
            }
            trigger="hover"
          >
            <EvaIcon status="Info" name="arrow-downward-outline" />
          </Tooltip>
        )}
      </span>
    );
  };

  const onHandleLock = (itemData) => {
    setIsLoadingRow(true);

    Fetch.put(
      `/formdata/blockmany`, {
        idForm,
        ids: [itemData.id],
      }
    )
      .then(() => {
        setInternalLocked(true);
        setIsLoadingRow(false);
      })
      .catch(() => {
        setIsLoadingRow(false);
      });
  };

  const onCloseFormView = () => {
    setFormSelectedView(undefined);
  };

  const hasPermissionToJustify = (itemData) => {
    return (
      data?.typeForm === "RVE" &&
      data?.appliedPermissions.canJustify &&
      !!itemData?.inconsistenciesType?.length &&
      !itemData?.justified
    );
  };



  if (isLoadingRow) {
    return (
      <TR key={key} isEvenColor={index % 2 === 0}>
        {data?.columns?.map((column, j) => (
          <TD key={`col-fWt-${j}-${index}`} textAlign="center">
            <SkeletonThemed />
          </TD>
        ))}
        <TD textAlign="center">
          <SkeletonThemed />
        </TD>
        <TD textAlign="center">
          <SkeletonThemed />
        </TD>
        <TD textAlign="center">
          <SkeletonThemed />
        </TD>
        <TD textAlign="center">
          <SkeletonThemed />
        </TD>
      </TR>
    );
  }

  const hasPermissionToDelete = data?.appliedPermissions?.canDeleteFormBoard;
  const hasPermissionToBlock = data?.appliedPermissions?.canBlock;
  const hasPermissionToEdit = data?.blocked
    ? hasPermissionToBlock && data?.appliedPermissions?.canEditFilling
    : data?.appliedPermissions?.canEditFilling;

  const itensAreBlocked = itemData?.blocked && !hasPermissionToBlock;

  return (
    <>
      <TR key={key} isEvenColor={index % 2 === 0}>
        {isBlockManyOn && (
          <TD textAlign="center" style={{ maxWidth: 50 }}>
            <Checkbox
              checked={itemData?.blocked || listToBlock?.includes(itemData.id)}
              disabled={itemData?.blocked}
              status="Warning"
              onChange={(e) => onSetToBlock(itemData)}
            />
          </TD>
        )}
        {data?.columns?.map((column, j) => (
          <TD key={`col-fWt-${j}-${index}`} textAlign="center">
            {data.typeForm === "EVENT" &&
              column.name === "prioridade" ? (
              <Badge
                status={getStatusBadge(
                  itemData.data[column.name]?.toLowerCase()
                )}
                style={{ position: "relative" }}
              >
                {getFormatCell(column, itemData, data)}
              </Badge>
            ) : (
              <TextSpan apparence="s2">
                {getFormatCell(column, itemData, data)}
              </TextSpan>
            )}
          </TD>
        ))}

        {data?.typeForm === "RDO" && (
          <TD textAlign="center">
            {getEstoqueIcons(itemData.data?.estoque)}
          </TD>
        )}
        <BodyContract itemData={itemData} data={data} />
        <BodyStatusDataColumn itemData={itemData} data={data} />
        {data?.typeForm !== "CMMS" && (
          <>
            <TD textAlign="center" style={{ maxWidth: 100 }} >
              <TextSpan apparence="p3">
                {itemData?.user?.name}
              </TextSpan>
            </TD>
            <TD textAlign="center" style={{ maxWidth: 100 }}>
              <TextSpan apparence="p2">
                {moment(itemData?.createAt).format("DD MMM YYYY")}
                <br />
                {moment(itemData?.createAt).format("HH:mm")}
              </TextSpan>
            </TD>
          </>
        )}
        {data?.typeForm === "RVE" && (
          <TD textAlign="center">
            <ConsumptionButton
              itemData={itemData}
              idForm={idForm}
            />
          </TD>
        )}
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
            <Tooltip
              placement="top"
              content={
                <>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="view" />
                  </TextSpan>
                </>
              }
              trigger="hint"
            >
              <Button
                size="Tiny"
                status="Primary"
                style={{ padding: 1 }}
                onClick={() =>
                  setFormSelectedView({
                    idForm,
                    id: itemData.id,
                  })
                }
              >
                <EvaIcon name="eye-outline" />
              </Button>
            </Tooltip>
            {!isBlockManyOn && hasPermissionToBlock && (
              <Tooltip
                placement="top"
                content={
                  <>
                    <TextSpan apparence="s2">
                      <FormattedMessage id={itemData?.blocked || internalLocked ? "blocked" : "block"} />
                    </TextSpan>
                  </>
                }
                trigger="hint"
              >
                <Button
                  size="Tiny"
                  status="Warning"
                  className="ml-3"
                  style={{ padding: 1 }}
                  disabled={itemData?.blocked || internalLocked}
                  onClick={() =>
                    onHandleLock(itemData)
                  }
                >
                  <EvaIcon name={itemData?.blocked || internalLocked ? "lock-outline" : "unlock-outline"} />
                </Button>
              </Tooltip>
            )}
            {!isBlockManyOn &&
            !itensAreBlocked &&
            hasPermissionToEdit && (
              <Tooltip
                placement="top"
                content={
                  <>
                    <TextSpan apparence="s2">
                      <FormattedMessage id="edit" />
                    </TextSpan>
                  </>
                }
                trigger="hint"
              >
                <Button
                  size="Tiny"
                  status="Basic"
                  className="ml-3"
                  style={{ padding: 1 }}
                  onClick={() =>
                    setFormSelected({
                      idForm,
                      id: itemData.id,
                    })
                  }
                >
                  <EvaIcon name="edit-2-outline" />
                </Button>
              </Tooltip>
            )}

            {
            !isBlockManyOn &&
            !itensAreBlocked && hasPermissionToJustify(itemData) && (
              <Tooltip
                placement="top"
                content={
                  <>
                    <TextSpan apparence="s2">
                      <FormattedMessage id="justify" />
                    </TextSpan>
                  </>
                }
                trigger="hint"
              >
                <Button
                  size="Tiny"
                  status="Warning"
                  apparence="ghost"
                  className="ml-3"
                  style={{ padding: 1 }}
                  onClick={() =>
                    onOpenRVEJustificationModal(itemData)
                  }
                >
                  <EvaIcon name="bell-off" />
                </Button>
              </Tooltip>
            )}

            {!isBlockManyOn && !itensAreBlocked && hasPermissionToDelete && (
              <DeleteItemRow
                onDeleteSuccess={onDeleteSuccess}
                itemData={itemData}
                setIsLoading={setIsLoading}
              />
            )}
            {!!formSelectedView && (
              <ModalViewForm
                formSelected={formSelectedView}
                isShow={!!formSelectedView}
                onClose={onCloseFormView}
                title={title}
                isRVE={data?.typeForm === "RVE"}
              />
            )}
          </Row>
        </TD>
      </TR>
    </>
  )
}
