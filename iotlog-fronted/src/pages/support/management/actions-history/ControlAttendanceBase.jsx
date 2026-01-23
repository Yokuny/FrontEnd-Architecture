import React from "react";
import Col from "@paljs/ui/Col";
import { injectIntl, FormattedMessage } from "react-intl";
import { Card, CardBody } from "@paljs/ui/Card";
import { InputGroup } from "@paljs/ui/Input";
import Select from "@paljs/ui/Select";
import Row from "@paljs/ui/Row";
import {
  UploadFile,
  FetchSupport,
  SpinnerFull,
  DateTime,
  SelectUserTeam,
} from "../../../../components";
import { toast } from "react-toastify";
import { Checkbox } from "@paljs/ui/Checkbox";
import ConfirmationShowMessage from "./ConfirmationShowMessage";
import { STATUS_ORDER_SUPPORT, ACTIONS_SUPPORT } from "../../../../constants";
import moment from "moment";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  input[type="date"] {
    line-height: 1.1rem;
  }

  input[type="time"] {
    line-height: 1.1rem;
  }

  svg {
    margin-top: -4px;
  }
`;

const ControlAttendanceBase = ({
  order,
  optionsActions,
  onChangeStatus,
  intl,
  permissionTransfer,
}) => {
  const [description, setDescription] = React.useState("");
  const [status, setStatus] = React.useState(undefined);
  const [files, setFiles] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showUserRequest, setShowUserRequest] = React.useState(false);
  const [date, setDate] = React.useState(undefined);
  const [time, setTime] = React.useState(undefined);
  const [user, setUser] = React.useState(undefined);
  const navigate = useNavigate();
  const onRemoveFile = (index) => {
    setFiles([...files.slice(0, index), ...files.slice(index + 1)]);
  };

  const onSend = async () => {
    if (!description) {
      toast.warn(intl.formatMessage({ id: "description.code.required" }));
      return;
    }

    if (!status) {
      toast.warn(intl.formatMessage({ id: "status.required" }));
      return;
    }

    if (
      status?.value == STATUS_ORDER_SUPPORT.WAITING_SCHEDULE &&
      !date &&
      !time
    ) {
      toast.warn(intl.formatMessage({ id: "date.time.required" }));
      return;
    }

    await onSaveAsync(
      {
        description,
        status:
          status?.value == ACTIONS_SUPPORT.TRANSFER
            ? status?.action
            : status?.value,
        idOrderSupport: order.id,
        userSuggestion: user,
        dateSchedule:
          status?.value == STATUS_ORDER_SUPPORT.WAITING_SCHEDULE
            ? moment(`${moment(date).format("YYYY-MM-DD")}T${time}:00Z`).utc().toDate()
            : null,
        idSuggestionUser: user?.value,
        nameSuggestionUser: user?.label,
        showUserRequest,
      },
      order.status != status.value
    );
  };

  const saveFileAsync = async (fileToSave, id, data) => {
    const formData = new FormData();
    formData.append("file", fileToSave);
    await FetchSupport.post(
      `/file/upload/historyorder?directory=historyordersupport&idHistoryOrderSupport=${id}&idOrder=${data.idOrderSupport}`,
      formData
    );
  };

  const onSaveAsync = async (data, goBack = false) => {
    setIsLoading(true);
    try {
      const response = await FetchSupport.post("/historyordersupport", data);
      const id = response.data?.data?.id;
      if (files?.length && !!id) {
        for await (const file of files) {
          await saveFileAsync(file, id, data);
        }
      }
      setIsLoading(false);
      setStatus(null);
      setDescription("");
      setFiles([]);
      setTime(undefined);
      setUser(undefined);
      setDate(undefined);
      setShowUserRequest(false);
      onChangeStatus(data.status);
      if (goBack) navigate(-1);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <Select
            options={optionsActions}
            noOptionsMessage={() =>
              intl.formatMessage({ id: "nooptions.message" })
            }
            placeholder={intl.formatMessage({
              id: "new.support.status.label",
            })}
            onChange={(value) => setStatus(value)}
            value={status}
          />

          <Checkbox
            className="ml-1 mt-2"
            checked={showUserRequest}
            onChange={() => setShowUserRequest(!showUserRequest)}
            status="Danger"
          >
            <FormattedMessage id="show.comment.user" />
          </Checkbox>
        </Col>
        <Col breakPoint={{ md: 8 }} className="mb-4">
          <InputGroup fullWidth>
            <textarea
              placeholder={intl.formatMessage({
                id: "comment",
              })}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              maxLength={2000}
            />
          </InputGroup>
        </Col>
        {status?.value == STATUS_ORDER_SUPPORT.SCHEDULE && (
          <Col breakPoint={{ md: 12 }} className="mb-4">
            <SelectUserTeam
              onChange={(value) => setUser(value)}
              value={user}
              idEnterprise={order?.idEnterprise}
              placeholder={intl.formatMessage({
                id: "to.user.maintenance",
              })}
            />
          </Col>
        )}
        {status?.value == STATUS_ORDER_SUPPORT.WAITING_SCHEDULE && [
          <Col breakPoint={{ md: 6 }} className="mb-4">
            <DateTime
              onChangeTime={setTime}
              onChangeDate={setDate}
              date={date}
              time={time}
              min={moment().utc().format("YYYY-MM-DD")}
            />
          </Col>,
          permissionTransfer && (
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectUserTeam
                onChange={(value) => setUser(value)}
                value={user}
                idEnterprise={order?.idEnterprise}
                placeholder={intl.formatMessage({
                  id: "select.user.team.optional",
                })}
                isClearable
              />
            </Col>
          ),
        ]}
        {status?.value == ACTIONS_SUPPORT.TRANSFER && (
          <Col breakPoint={{ md: 12 }} className="mb-4">
            <SelectUserTeam
              onChange={(value) => setUser(value)}
              value={user}
              idEnterprise={order?.idEnterprise}
            />
          </Col>
        )}
        {permissionTransfer &&
          status?.value == STATUS_ORDER_SUPPORT.WAITING_MAINTENANCE && (
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <SelectUserTeam
                onChange={(value) => setUser(value)}
                value={user}
                idEnterprise={order?.idEnterprise}
                placeholder={intl.formatMessage({
                  id: "select.user.team.optional",
                })}
                isClearable
              />
            </Col>
          )}
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <UploadFile
            onAddFiles={setFiles}
            onRemoveFile={onRemoveFile}
            files={files}
            colMd={3}
          />
        </Col>
      </ContainerRow>
      <ConfirmationShowMessage showUser={showUserRequest} onSave={onSend} />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};
export default injectIntl(ControlAttendanceBase);
