import React from "react";
import styled from "styled-components";
import Badge from "@paljs/ui/Badge";
import moment from "moment";
import { useIntl } from "react-intl";
import { TextSpan, LoadingCard } from "../../../../components";
import {
  TablePagineted,
  TDStyled,
  TRStyled,
} from "../../../../components/TablePagineted";

import { getStatus } from "../../services";

const Img = styled.img`
  width: 70px;
  max-width: 70px;
  max-height: 70px;
  height: 70px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
`;

const ListBase = ({
  data,
  onPageChanged,
  isLoading,
  onClick,
  initialText = "",
  showSchedule = false,
  showEnd = false,
  showSlaSolution = false,
  showSlaFirst = false,
}) => {
  const intl = useIntl();

  const breakDateTime = (dateTime) => {
    return (
      <>
        {moment(dateTime).format(
          intl.formatMessage({ id: "format.date" })
        )}
        <br />
        {moment(dateTime).format(
          intl.formatMessage({ id: "format.hour" })
        )}
      </>
    );
  };

  const normalizeDescription = (text) => {
    const partsWithContact = text.split("\n");
    if (
      partsWithContact[0]?.toLowerCase()?.includes("contato") &&
      partsWithContact[1]?.toLowerCase()?.includes("email")
    ) {
      return partsWithContact.slice(3).join("\n");
    }

    return text;
  };

  const contactData = (text) => {
    const partsWithContact = text.split("\n");
    if (
      partsWithContact[0]?.toLowerCase()?.includes("contato") &&
      partsWithContact[1]?.toLowerCase()?.includes("email")
    ) {
      return (
        <>
          <br />
          {partsWithContact[0].replace("Contato: ", "")}
        </>
      );
    }

    return undefined;
  };

  const renderItem = ({ item, index }) => {
    const status = getStatus(item.status);

    const hasContactInfo = contactData(item?.description);

    return (
      <TRStyled
        key={`row-${index}`}
        style={{ cursor: "pointer" }}
        onClick={() => onClick(item.id)}
      >
        <TDStyled textAlign="center">
          <TextSpan apparence="s2">{item?.code}</TextSpan>
        </TDStyled>
        <TDStyled>
          <TextSpan className="text-ellispis" apparence="s2">
            {normalizeDescription(item?.description)}
          </TextSpan>
        </TDStyled>
        <TDStyled textAlign="center">
          <TextSpan apparence="s2">{item?.typeProblem}</TextSpan>
        </TDStyled>
        <TDStyled textAlign="center">
          {item?.urlProductServiceImage ? (
            <Img
              className="mt-2 mb-2"
              src={item.urlProductServiceImage}
              alt={item.productService}
            />
          ) : (
            <div style={{ minHeight: 50 }}></div>
          )}
        </TDStyled>

        <TDStyled textAlign="center">
          <TextSpan apparence="s2">{item?.productService}</TextSpan>
        </TDStyled>
        <TDStyled textAlign="center">
          <TextSpan apparence="s2">{breakDateTime(item?.createdAt)}</TextSpan>
        </TDStyled>
        <TDStyled textAlign="center">
          <TextSpan apparence="s2">
            {item?.userRequest}
            {hasContactInfo}
          </TextSpan>
        </TDStyled>

        <TDStyled textAlign="center">
          <Badge
            status={status.badge}
            className="mt-2"
            style={{
              position: "relative",
            }}
          >
            {intl.formatMessage({ id: status.textId }).toUpperCase()}
          </Badge>
        </TDStyled>
        {showSlaFirst && (
          <TDStyled textAlign="center">
            <TextSpan apparence="s2">
              {item?.dateSlaAttendance
                ? breakDateTime(item?.dateSlaAttendance)
                : ""}
            </TextSpan>
          </TDStyled>
        )}
        {showSlaSolution && (
          <TDStyled textAlign="center">
            <TextSpan apparence="s2">
              {item?.dateSlaSolution
                ? breakDateTime(item?.dateSlaSolution)
                : ""}
            </TextSpan>
          </TDStyled>
        )}
        {showSchedule && (
          <TDStyled textAlign="center">
            <TextSpan apparence="s2">
              {item?.dateSchedule ? breakDateTime(item?.dateSchedule) : ""}
            </TextSpan>
          </TDStyled>
        )}
        {showEnd && (
          <TDStyled textAlign="center">
            <TextSpan apparence="s2">
              {item?.closedAt ? breakDateTime(item?.closedAt) : ""}
            </TextSpan>
          </TDStyled>
        )}
      </TRStyled>
    );
  };

  const showHeaders = [
    {
      textId: "code",
      textAlign: "center",
    },
    {
      textId: "description",
    },
    {
      textId: "type",
      textAlign: "center",
    },
    {
      textId: "image",
      textAlign: "center",
    },
    {
      textId: "local",
      textAlign: "center",
    },
    {
      textId: "open.in",
      textAlign: "center",
    },
    {
      textId: "user.request",
      textAlign: "center",
    },
    {
      textId: "status",
      textAlign: "center",
    },
  ];

  showSlaFirst &&
    showHeaders.push({
      textId: "sla.attendance",
      textAlign: "center",
    });

  showSlaSolution &&
    showHeaders.push({
      textId: "sla.solution",
      textAlign: "center",
    });

  showSchedule &&
    showHeaders.push({
      textId: "schedule.to",
      textAlign: "center",
    });

  showEnd &&
    showHeaders.push({
      textId: "closed.at",
      textAlign: "center",
    });

  return (
    <>
      <LoadingCard isLoading={isLoading} />
      <TablePagineted
        tableId="list_support"
        headers={showHeaders}
        data={data?.rows}
        totalItems={data?.count}
        renderItem={renderItem}
        onPageChanged={onPageChanged}
        contentStyle={{
          padding: 0,
        }}
        initialText={initialText}
      />
    </>
  );
};

export default ListBase;
