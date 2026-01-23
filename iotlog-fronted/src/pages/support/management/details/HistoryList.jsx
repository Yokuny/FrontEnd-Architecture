import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { LoadingCard, FetchSupport, TextSpan } from "../../../../components";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import { getStatus } from "../../services";
import Badge from "@paljs/ui/Badge";
import User from "@paljs/ui/User";
import moment from "moment";
import Col from "@paljs/ui/Col";
import styled from "styled-components";
import { STATUS_ORDER_SUPPORT } from "../../../../constants";
import { useSocket } from "../../../../components/Contexts/SocketContext";

const ColText = styled(Col)`
  margin: 0px;
  padding: 10px 0 0 0;
  display: flex;
  flex-direction: column;
`;

const HistoryList = (props) => {
  const { intl } = props;

  const [data, setData] = React.useState([]);
  const [newHistory, setNewHistory] = React.useState([]);
  const [newFiles, setNewFiles] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !props.order?.id) {
      return;
    }
    if (props.isManagement) {
      socket.emit("join", {
        topics: [
          `historyordersupport_${props.order.id}`,
          `filehistoryordersupport_${props.order.id}`,
        ],
      });
      socket.on(`historyordersupport_${props.order.id}`, (payload) => {
        setNewHistory(payload);
      });
      socket.on(`filehistoryordersupport_${props.order.id}`, (payload) => {
        setNewFiles(payload);
      });
    }
    return () => {
      if (socket) {
        socket.emit("leave", {
          topics: [
            `historyordersupport_${props.order.id}`,
            `filehistoryordersupport_${props.order.id}`,
          ],
        });
        socket.off(`historyordersupport_${props.order.id}`, (payload) => {
          setNewHistory(payload);
        }
        );
        socket.off(`filehistoryordersupport_${props.order.id}`, (payload) => {
          setNewFiles(payload);
        });
      }
    };
  }, [socket]);

  React.useEffect(() => {
    findData();
  }, [props.order.id, props.isManagement]);

  React.useEffect(() => {
    if (!!newHistory?.length) {
      setData([...newHistory, ...data]);
    }
  }, [newHistory]);

  React.useEffect(() => {
    if (!!newFiles?.length) {
      const fileIndex = data.findIndex((x) => x.id == newFiles[0].id);
      const fileToUpdate = data[fileIndex];

      if (!!fileToUpdate.files?.length) {
        fileToUpdate.files = [...fileToUpdate.files, newFiles[0]];
      } else {
        fileToUpdate.files = newFiles;
      }

      setData([
        ...data.slice(0, fileIndex),
        fileToUpdate,
        ...data.slice(fileIndex + 1),
      ]);
    }
  }, [newFiles]);

  const findData = () => {
    setIsLoading(true);
    let url = props.isManagement
      ? "/historyordersupport/timeline"
      : "/historyordersupport/my-timeline";
    FetchSupport.get(`${url}?idOrder=${props.order.id}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <LoadingCard isLoading={isLoading}>
        {!!data?.length &&
          data.map((history, i) => {
            const status = getStatus(history.status);
            return (
              <Card key={i}>
                <CardBody>
                  <Badge status={status.badge}>
                    <FormattedMessage id={status.textId} />
                  </Badge>
                  <ColText>
                    <TextSpan apparence="p1">{history.description}</TextSpan>
                    {!!history.dateSchedule && (
                      <TextSpan apparence="c2" className="mt-1">
                        {history.status == STATUS_ORDER_SUPPORT.WAITING_SCHEDULE
                          ? `${intl.formatMessage({ id: "suggestion" })}: `
                          : ``}
                        {moment(history.dateSchedule).utc().format(
                          intl.formatMessage({ id: "format.datetimewithoutss" })
                        )}
                      </TextSpan>
                    )}
                    {history.status == STATUS_ORDER_SUPPORT.SCHEDULE && (
                      <TextSpan apparence="c2" className="mt-1">
                        {`${intl.formatMessage({ id: "schedule.to" })}: `}
                        {moment(props.order.dateSchedule).utc().format(
                          intl.formatMessage({ id: "format.datetimewithoutss" })
                        )}
                      </TextSpan>
                    )}
                    {!!history.nameSuggestionUser && (
                      <TextSpan apparence="c2" className="mt-1">
                        <FormattedMessage id="transfered.to" />{" "}
                        {history.nameSuggestionUser}
                      </TextSpan>
                    )}
                    {!!history?.files?.length &&
                      history.files.map((file, i) => (
                        <a
                          key={i}
                          href={file.url}
                          target="_blank"
                          className="text-file-name-start"
                        >
                          <TextSpan apparence="c2" className="mt-2">
                            {file.originalName || file.url}
                          </TextSpan>
                        </a>
                      ))}
                  </ColText>
                </CardBody>
                <CardFooter>
                  <User
                    size="Tiny"
                    name={history.userName}
                    title={moment(history.date).format(
                      intl.formatMessage({ id: "format.datetimewithoutss" })
                    )}
                  />
                </CardFooter>
              </Card>
            );
          })}
      </LoadingCard>
    </>
  );
};

export default injectIntl(HistoryList);
