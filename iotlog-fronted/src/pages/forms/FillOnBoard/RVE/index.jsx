import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Button, EvaIcon, Row } from "@paljs/ui";
import { toast } from "react-toastify";
import styled from "styled-components";
import RVEForm from "./RVEForm";
import TableLoading from "../TableLoading";
import { DeleteConfirmation, Fetch, TextSpan } from "../../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table";

const RowCenter = styled.div`
  display: flex;
  justify-content: center;
`

function RVEFillOnBoard(props) {

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [formSelected, setFormSelected] = useState();
  const [idForm, setIdForm] = useState();
  const intl = useIntl();

  useEffect(() => {
    if (props.idEnterprise) {
      getFormRVE(props.date, props.idEnterprise, props.idMachine);
    }
  }, [props.date, props.idEnterprise, props.idMachine])

  const getFormRVE = async (date, idEnterprise, idMachine) => {
    setIsLoading(true);
    try {
      if (!idForm) {
        const response = await Fetch.get(`/form/itemtype?idEnterprise=${idEnterprise}&type=RVE`);
        if (response?.data?.id) {
          await getDataAsync(date, response.data.id, idMachine);
        }
        else {
          toast.warn(intl.formatMessage({ id: "error.get.form" }));
        }
      } else {
        await getDataAsync(date, idForm, idMachine);
      }
    }
    catch {

    }
    finally {
      setIsLoading(false);
    }
  }

  const getDataAsync = async (date, idForm, idMachine) => {
    const query = []
    query.push(`date=${date}`)
    query.push(`timezone=${props.timezone}`)
    query.push(`fieldInit=dataHoraInicio`)
    query.push(`fieldEnd=dataHoraFim`)
    query.push(`idForm=${idForm}`)
    if (idMachine)
      query.push(`embarcacao=${idMachine}`)
    const columns = ["codigoOperacional", "escala", "dataHoraInicio", "dataHoraFim"]
    columns.forEach((column) => query.push(`columns=${column}`))
    let response = {};
    try {
      response = await Fetch.get(`/formdata/listdatafill?${query.join('&')}`);
      setData(response?.data?.length ? response.data : []);
      setIdForm(idForm);
    }
    catch {
    }

    return response?.data;
  }

  const getData = (date, idMachine) => {
    setIsLoading(true);
    getDataAsync(date, idForm, idMachine)
      .then(data => setData(data?.length ? data : []))
      .finally(() => setIsLoading(false));

  }

  const onDelete = (id) => {
    if (!id) return
    setIsLoading(true);
    Fetch.delete(`/formdata?id=${id}`)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        setData(prevState => prevState?.filter(x => x.id !== id))
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  const onCloseForm = (isNeedReload = false) => {
    setFormSelected(undefined);
    if (isNeedReload) {
      getData(props.date, props.idMachine)
    }
  }

  const hasPermissionEdit = props.items?.some((x) => x === "/edit-fill-form-board");
  const hasPermissionAdd = props.items?.some((x) => x === "/fill-form-board");
  const hasPermissionToDelete = props.items?.some((x) => x === "/delete-form-board");

  return (<>
    <TABLE>
      <THEAD>
        <TRH>
          <TH textAlign="center">
            <TextSpan apparence="s2" hint>
              <FormattedMessage id="unit" />
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="s2" hint>
              <FormattedMessage id="code" />
            </TextSpan>
          </TH>
          <TH textAlign="center">
            <TextSpan apparence="s2" hint>
              <FormattedMessage id="hour" />
            </TextSpan>
          </TH>
          {(hasPermissionEdit || hasPermissionToDelete) &&
            <TH textAlign="center" style={{ width: 80 }}>
              <TextSpan apparence="s2" hint>
                <FormattedMessage id="actions" />
              </TextSpan>
            </TH>}
        </TRH>
      </THEAD>
      <TBODY>
        {isLoading
          ? <TableLoading cols={4} rows={5} />
          : <>
            {data.map((item, index) => (
              <TR key={index} isEvenColor={index % 2 === 0}>
                <TD textAlign="center">
                  <TextSpan apparence="s2">{item?.escala?.label?.split(' - ')[0]}</TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="s2">{item?.codigoOperacional?.value}</TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="s2">{item?.dataHoraInicio ? moment(item?.dataHoraInicio).format('HH:mm') : '-'}</TextSpan>
                </TD>
                {(hasPermissionEdit || hasPermissionToDelete) && <TD>
                  <Row middle="xs" center="xs"
                    className="m-0"
                    style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                    {hasPermissionEdit &&
                      item?.isAllowEdit &&
                      <Button size="Tiny" status="Basic"
                        className="ml-1"
                        style={{ padding: 1 }}
                        onClick={() => setFormSelected({ idForm, id: item.id })}
                      >
                        <EvaIcon name="edit-2-outline" />
                      </Button>}

                    {hasPermissionToDelete &&
                      item?.isAllowEdit &&
                      <DeleteConfirmation
                        onConfirmation={() => onDelete(item.id)}
                        message={intl.formatMessage({ id: "delete.message.default" })}
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
                      </DeleteConfirmation>}
                  </Row>
                </TD>}
              </TR>
            ))}
          </>}
      </TBODY>
    </TABLE>
    {hasPermissionAdd &&
      !isLoading &&
      <RowCenter className="mt-4">
        <Button size="Tiny"
          onClick={() => setFormSelected({ idForm })}
          className="flex-between" style={{ paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2 }}>
          <EvaIcon name="plus-circle-outline" className="mr-1" />
          <FormattedMessage id="add" /> RVE
        </Button>
      </RowCenter>}
    {!!formSelected && <RVEForm
      formSelected={formSelected}
      onClose={onCloseForm}
      idMachine={props.idMachine}
      title={'RVE'}
    />}
  </>)
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(RVEFillOnBoard);
