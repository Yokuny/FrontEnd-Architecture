import { Button, EvaIcon } from "@paljs/ui";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Fetch, Modal, TextSpan } from "../../../../components";
import { translate } from "../../../../components/language";
import ConsumptionForm from "./ConsumptionForm";
import ConsumptionInfoCard from "./ConsumptionInfoCard";
import moment from "moment";

const EmptyDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const InfoCardWrapper = styled.div`
  padding-top: 18px;
  padding-bottom: 18px;
  gap: 24px;
  display: flex;
  justify-content: space-between;
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  gap: 12px;
`;

const ConsumptionFillOnBoard = (props) => {

  const { idMachine, date, items, enterprises } = props;

  const [suppliesConsumption, setSuppliesConsumption] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [modalVisibility, setModalVisibility] = useState(false)
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false)

  const idEnterprise = enterprises?.length
    ? enterprises[0].id
    : "";

  useEffect(() => {
    if (idMachine && date && idEnterprise)
      getData();
  }, [idMachine, date, idEnterprise])

  function getData() {
    setIsLoading(true);

    Fetch.get(`/machine-supplies-consumption/find?idMachine=${idMachine}&date=${date}&timezone=${moment().format('Z')}`)
      .then((response) => {
        setSuppliesConsumption(response.data)

      })
      .catch((error) => {

        if (error.response.status === 404) {
          setSuppliesConsumption(null)
        } else {
          // TO DO
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
  };

  async function handleDelete() {
    setIsLoading(true)
    setDeleteModalVisibility(false)
    try {
      await Fetch.post(`/machine-supplies-consumption/remove`, { id: suppliesConsumption._id })

    } catch (error) {
      return toast.danger(translate("error.delete"));

    } finally {
      setSuppliesConsumption(undefined)
      setIsLoading(false)
      toast.success(translate("delete.success"))
    }
  };

  const closeModal = (reload = false) => {
    if (reload) getData()
    setModalVisibility(false)
  }

  const hasPermissionEdit = items?.some((x) => x === "/edit-fill-form-board");
  const hasPermissionAdd = items?.some((x) => x === "/fill-form-board");
  const hasPermissionToDelete = items?.some((x) => x === "/delete-form-board");

  return (
    <>

      {suppliesConsumption ? (

        <>
          {(hasPermissionEdit || hasPermissionToDelete) && (
            <ActionsWrapper>

              {hasPermissionEdit && (
                <Button size="Tiny"
                  status="Basic"
                  className="flex-between"
                  onClick={() => setModalVisibility(true)}>
                  <EvaIcon name="edit-outline" className="mr-1" />
                  <FormattedMessage id="edit" />
                </Button>
              )}

            </ActionsWrapper>
          )}

          {suppliesConsumption && (
            <InfoCardWrapper>
              <ConsumptionInfoCard
                title={"machine.supplies.consumption.oil"}
                supplyConsumption={suppliesConsumption.oil}
                isLoading={isLoading}
              />
              <ConsumptionInfoCard
                title={"machine.supplies.consumption.potable.water"}
                supplyConsumption={suppliesConsumption.water}
                isLoading={isLoading}
              />
            </InfoCardWrapper>
          )}
        </>

      ) : (
        <EmptyDiv className="mt-4">
          <RowFlex>
            <EvaIcon name="alert-circle-outline"
              status="Basic"
              className="mr-1" />
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="machine.supplies.consumption.no.register" />
            </TextSpan>
          </RowFlex>

          <div style={{ height: 12 }} />

          {hasPermissionAdd && (
            <Button size="Tiny" className="flex-between" onClick={() => setModalVisibility(true)}>
              <EvaIcon name="plus-circle-outline" className="mr-1" />
              <FormattedMessage id="add" />
            </Button>
          )}

        </EmptyDiv>
      )}

      <Modal
        textTitle={(<FormattedMessage id="machine.supplies.consumption" />)}
        onClose={() => setModalVisibility(false)}
        size="Large"
        show={modalVisibility}
        styleContent={{ maxHeight: "calc(100vh - 220px)", overflowX: 'hidden' }}
      >
        <ConsumptionForm
          suppliesConsumption={suppliesConsumption}
          idMachine={idMachine}
          idEnterprise={idEnterprise}
          closeModal={closeModal}
          date={date}
          updateSuppliesConsumption={setSuppliesConsumption}
          openDeleteModal={() => setDeleteModalVisibility(true)}
          hasPermissionToDelete={hasPermissionToDelete}
        />
      </Modal>

      <Modal
        textTitle={(<FormattedMessage id="delete" />)}
        onClose={() => setDeleteModalVisibility(false)}
        size="Small"
        show={deleteModalVisibility}
        accent="Danger"
        renderFooter={() => (
          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', padding: 12 }}>
            <Button onClick={() => setDeleteModalVisibility(false)}>
              <FormattedMessage id="not" />
            </Button>
            <Button onClick={() => handleDelete()} status="Danger" >
              <FormattedMessage id="yes" />
            </Button>
          </div>
        )}
      >
        <FormattedMessage id="delete.message.default" />
      </Modal>

    </>
  )
}


const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(ConsumptionFillOnBoard);
