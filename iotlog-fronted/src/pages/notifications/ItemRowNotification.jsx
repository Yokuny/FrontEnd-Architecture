import {
  Badge,
  Button,
  Checkbox,
  Col,
  EvaIcon,
  Row,
} from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import {
  TextSpan,
} from "../../components";
import { formatDateDiff } from "../../components/Utils";
import {
  getColorLevel,
  getColorStatus,
  getIconLevel,
} from "./NotificationsService";
import { nanoid } from "nanoid";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ isCursor }) => isCursor && `cursor: pointer;`}
`;

const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default function ItemRowNotification(props) {

  const { item, listToResolve, onChangeCheck, setItemSelected, isShowSolution } = props;

  const [isOpenDetail, setIsOpenDetail] = React.useState(false);

  const intl = useIntl();
  const theme = useTheme();

  const colorTextTheme = getColorLevel(item.level);
  const iconName = getIconLevel(item.level);
  const isNew = !item.readAt;
  const animation = isNew
    ? { type: "pulse", infinite: true, hover: false }
    : { type: "shake", hover: true };

  return (
    <>
      <Row
        key={nanoid(5)}
        className="pt-4 pb-4 mb-4"
        middle="xs"
        style={{
          border: `1px solid ${theme.borderBasicColor4}`,
          borderRadius: 2,
        }}>
        <Col
          breakPoint={{ md: 2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Checkbox
            checked={listToResolve?.some((x) => x === item.id)}
            onChange={() => onChangeCheck(item.id)}
            disabled={!!item.resolvedAt}
          />
          <Button
            status={getColorStatus(item.level)}
            appearance="outline"
            style={{ border: 0, padding: `0.4rem 0.6rem` }}
            size="Small"
            className="flex-between ml-3"
          >
            <EvaIcon
              name={iconName}
              options={{
                fill: theme[colorTextTheme],
                animation,
              }}
              className="mr-1"
            />
            {item.level || intl.formatMessage({ id: "other" })}
          </Button>
        </Col>
        <Col
          breakPoint={{ md: 4 }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <TextSpan apparence="s2">
          {item.subtitle?.length &&
          item.subtitle?.length > item.title?.length ?
          item.subtitle?.replaceAll("*", "") : item.title?.replaceAll("*", "")}
          </TextSpan>
          {isNew && (
            <Badge
              position="absolute"
              style={{
                top: 0,
                right: 10
              }}
              status={getColorStatus(item.level)}>
              <FormattedMessage id="new" />
            </Badge>
          )}
        </Col>
        <ColCenter breakPoint={{ md: 3 }}>
          <RowRead isCursor>
            <EvaIcon
              name="calendar-outline"
              status="Basic"
              className="mt-1 mr-1"
              options={{ height: 17, width: 17 }}
            />
            <TextSpan apparence="p2" style={{ marginTop: 2 }} hint>
              {moment(item.data.date || item.createAt).format("DD MMM YYYY, HH:mm")}
            </TextSpan>
          </RowRead>
        </ColCenter>
        <ColCenter breakPoint={{ md: 2 }}>
          {!!item.resolvedAt && (
            <RowRead>
              <EvaIcon
                name="done-all-outline"
                status="Info"
                className="mt-1"
                options={{ height: 17, width: 17 }}
              />
              <TextSpan
                apparence="p2"
                className="ml-1"
                status="Info"
                hint
                style={{ marginTop: 2 }}
              >
                {`${formatDateDiff(item.resolvedAt, intl, "resolve.at")}`}
              </TextSpan>
            </RowRead>
          )}
          {isShowSolution && !item.resolvedAt && (
            <Row
              style={{
                display: "flex",
                flexDirection: "row",
              }}
              end="xs"
              className="m-0">
              <Button
                size="Tiny"
                status="Info"
                appearance="ghost"
                className="flex-between"
                onClick={() => setItemSelected(item)}
              >
                <EvaIcon name="edit-2-outline" className="mr-1" />
                <FormattedMessage id="justify" />
              </Button>
            </Row>
          )}
        </ColCenter>
        <ColCenter breakPoint={{ md: 1 }}>
          <Button
            size="Tiny"
            status="Basic"
            appearance="ghost"
            className="flex-between"
            onClick={() => setIsOpenDetail(!isOpenDetail)}
          >
            <EvaIcon name={!isOpenDetail ? "arrow-ios-downward" : "arrow-ios-upward"} />
          </Button>
        </ColCenter>
        {isOpenDetail && (
          <Col breakPoint={{ xs: 12 }} className="mt-4">
            <Row>
              <Col breakPoint={{ xs: 2 }} className="mb-2"></Col>
              <Col breakPoint={{ xs: 10 }} className="mb-2">
                <TextSpan apparence="p2">
                  {item.title.replaceAll("*", "")}
                </TextSpan>
              </Col>
              <Col breakPoint={{ xs: 2 }}></Col>
              <Col breakPoint={{ xs: 10 }}>
                <TextSpan apparence="p2">
                  {item.description}
                </TextSpan>
              </Col>
            </Row>
          </Col>
        )

        }
      </Row>
    </>
  );
}
