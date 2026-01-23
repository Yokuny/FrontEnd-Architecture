import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import { connect } from "react-redux";
import { Button, EvaIcon, Row } from "@paljs/ui";
import { toast } from "react-toastify";
import styled from "styled-components";
import ModalFillForm from "../../Filled/ModalFillForm";
import TableLoading from "../TableLoading";
import { DeleteConfirmation, Fetch, TextSpan } from "../../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table";


const RowCenter = styled.div`
  display: flex;
  justify-content: center;
`

function NoteEletronicFillOnBoard(props) {

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [formSelected, setFormSelected] = useState();
  const [idForm, setIdForm] = useState();
  const intl = useIntl();

  useEffect(() => {
    if (props.idEnterprise)
      getFormType(props.date, props.idEnterprise);
  }, [props.date, props.idEnterprise])

  const getFormType = async (date, idEnterprise) => {
    setIsLoading(true);
    try {
      const response = await Fetch.get(`/form/itemtype?idEnterprise=${idEnterprise}&type=EVENT_REPORT`);
      if (response?.data?.id) {
        await getDataAsync(date, response.data.id);
      }
      else {
        toast.warn(intl.formatMessage({ id: "error.get.form" }));
      }
    }
    catch {

    }
    finally {
      setIsLoading(false);
    }
  }

  const getDataAsync = async (date, idForm) => {

    const query = []
    query.push(`date=${date}`)
    query.push(`timezone=${props.timezone}`)
    query.push(`fieldInit=data`)
    query.push(`fieldEnd=data`)
    if (idForm)
      query.push(`idForm=${idForm}`)
    const columns = ["data", "observacao"]
    columns.forEach((column) => query.push(`columns=${column}`))

    let response = {};
    try {
      response = await Fetch.get(`/formdata/listdatafill?${query.join('&')}`)
      setData(response.data ? response.data : [])
      setIdForm(idForm)
    }
    catch {
    }
    return response?.data;
  }

  const getData = (date) => {
    setIsLoading(true);
    getDataAsync(date, idForm)
      .then(data => setData(data?.length ? data : []))
      .finally(() => setIsLoading(false));
  }

  const onCloseForm = (isNeedReload = false) => {
    setFormSelected(undefined);
    if (isNeedReload) {
      getData(props.date)
    }
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

  const hasPermissionEdit = props.items?.some((x) => x === "/edit-fill-form-board");
  const hasPermissionAdd = props.items?.some((x) => x === "/fill-form-board");
  const hasPermissionToDelete = props.items?.some((x) => x === "/delete-form-board");

  return (<>
    <TABLE>
      <THEAD>
        <TRH>
          <TH textAlign="center" style={{ width: 80 }}>
            <TextSpan apparence="s2" hint>
              <FormattedMessage id="hour" />
            </TextSpan>
          </TH>
          <TH>
            <TextSpan apparence="s2" hint>
              <FormattedMessage id="observation" />
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
          ? <TableLoading cols={3} rows={5} />
          : <>
            {data.map((item, index) => (
              <TR key={index} isEvenColor={index % 2 === 0}>
                <TD textAlign="center">
                  <TextSpan apparence="s2">{item?.data ? moment(item?.data).format('HH:mm') : '-'}</TextSpan>
                </TD>
                <TD>
                  <TextSpan apparence="s2">{item?.observacao}</TextSpan>
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
        <Button
          onClick={() => setFormSelected({ idForm })}
          size="Tiny" status="Info" className="flex-between" style={{ paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2 }}>
          <EvaIcon name="edit-outline" className="mr-1" />
          <FormattedMessage id="new" /> <FormattedMessage id="event" />
        </Button>
      </RowCenter>}
    {!!formSelected && <ModalFillForm
      formSelected={formSelected}
      idMachine={props.idMachine}
      fillMachine
      onClose={onCloseForm}
      title={'Bandalho Eletrônico'}
    />}
  </>)
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(NoteEletronicFillOnBoard);
