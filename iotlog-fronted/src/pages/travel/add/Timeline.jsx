import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { Fetch, TextSpan } from "../../../components";
import moment from "moment";
import { IconBorder } from "../../../components/Icons/IconRounded";
import { EvaIcon } from "@paljs/ui";


const Item = styled.li`
  ${({ theme, color = "", noLine = false }) => css`
    ${!noLine
      ? `border-left: 2px solid ${color ?? theme.colorBasicFocusBorder};`
      : `border-left: 2px solid ${theme.backgroundBasicColor1};`}
  `}
  list-style: none;
`;

const ContainerIcon = styled.div`
  position: absolute;
  margin-left: -1.8rem;
`;

export default function Timeline({ travelId }) {
  const theme = useTheme();
  const intl = useIntl();

  const [data, setData] = useState();

  useEffect(() => {
    if (travelId) getEventsAuto(travelId);

    return () => {
      setData([])
    }
  }, [travelId]);

  const getEventsAuto = (travelId) => {
    if (travelId) {
      Fetch.get(`/travel/manual-voyage/timeline/${travelId}`)
        .then((response) => {
          setData(response.data?.length ? response.data : []);
        })
        .catch((e) => {
          setData([]);
        });
    }
  };

  const getIcon = (name) => {
    if (name === "created")
      return {
        name: "checkmark-outline",
        color: theme.colorBasic500,
        bgColor: theme.colorBasic100,
        text: "trip.created",
      };

    if (name === "finished")
      return {
        name: "done-all-outline",
        color: theme.colorSuccess500,
        bgColor: theme.colorSuccess100,
        text: "trip.completed",
      };

    if (name === "updated")
      return {
        name: "edit-outline",
        color: theme.colorWarning500,
        bgColor: theme.colorWarning100,
        text: "updated.trip",
      };
  };

  const eventsManualNormalized = () => {
    return (
      data?.map((x) => {
        const iconProps = getIcon(x.type);
        return {
          type: x.type,
          date: moment(x.createAt).format('DD/MM/YYYY hh:mm'),
          user: x.user,
          iconProps,
          title: intl.formatMessage({ id: iconProps.text }),
        };
      }) || []
    );
  };

  const eventsSorted = eventsManualNormalized();

  return (
    <>
      <div className="pt-4 pl-4">
        {eventsSorted?.map((x, i) => (
          <Item
            noLine={i === eventsSorted?.length - 1}
            key={`event-${i}`}
            color={x.iconProps.color}
            className="pl-4 pb-4"
          >
            <ContainerIcon>
              <IconBorder
                borderColor={x.iconProps.color}
                color={x.iconProps.color}
                style={{ padding: 1 }}
              >
                <EvaIcon
                  name={x.iconProps.name}
                  options={{ width: 20, fill: "#fff" }}
                />
              </IconBorder>
            </ContainerIcon>
            <div className="col-flex pb-4 pl-2">
              <TextSpan apparence="c3" style={{ textTransform: "uppercase" }}>
                {x.title}
              </TextSpan>
              <TextSpan
                apparence="p3"
                className="mt-0"
                hint
                style={{ lineHeight: "9px", wordWrap: "break-word" }}
              >
                {x.formatedDate}
              </TextSpan>
              <TextSpan
                apparence="p3"
                className="mt-1"
                hint
                style={{ lineHeight: "9px", wordWrap: "break-word" }}
              >
                {x.date}
              </TextSpan>
              {!!x.user && (
                <TextSpan
                  apparence="p3"
                  className="mt-2"
                  hint
                  style={{ lineHeight: "9px", wordWrap: "break-word" }}
                >
                  {x.user.name}
                </TextSpan>
              )}
              {!!x.supplier && (
                <>
                  <TextSpan
                    apparence="p3"
                    className="mt-2"
                    hint
                    style={{ lineHeight: "9px", wordWrap: "break-word" }}
                  >
                    {x.supplier.name}
                  </TextSpan>
                  <TextSpan
                    apparence="p3"
                    className="mt-2"
                    hint
                    style={{ lineHeight: "9px", wordWrap: "break-word" }}
                  >
                    {x.supplier.razao}
                  </TextSpan>
                </>
              )}
              {!!x.payload && (
                <TextSpan
                  apparence="p3"
                  className="mt-2"
                  hint
                  style={{ lineHeight: "9px", wordWrap: "break-word" }}
                >
                  {x.payload}
                </TextSpan>
              )}
            </div>
          </Item>
        ))}
      </div>
    </>
  );
}
