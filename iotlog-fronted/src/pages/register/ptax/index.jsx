import { Button, Card, CardBody, CardHeader, Row } from "@paljs/ui";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Fetch, SpinnerFull, TextSpan } from "../../../components";
import PtaxAdd from "./PtaxAdd";
import PtaxTable from "./PtaxTable";
import { connect } from "react-redux";

function PtaxList(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPtax, setSelectedPtax] = useState(null);
  const isEdit = useRef(false);

  const intl = useIntl();

  useEffect(() => {
    if (props.isReady && props.enterprises?.length) {
      fetchData(props.enterprises[0].id);
    }

  }, [props.isReady, props.enterprises]);

  function fetchData(idEnterprise) {
    setIsLoading(true);

    Fetch.get(`/ptax?idEnterprise=${idEnterprise}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }


  function handleEdit(ptax) {
    isEdit.current = true;
    setSelectedPtax(ptax);
  }

  function handleNew() {
    isEdit.current = false;
    setSelectedPtax({
      date: new Date().toISOString(),
    });
  }

  function handleSave(dataToSave) {
    const raw = {
      idEnterprise: localStorage.getItem("id_enterprise_filter"),
      value: dataToSave.value,
      date: dataToSave.date,
    };

    if (!raw.value || !raw.date) {
      toast.warn(intl.formatMessage({ id: "fill.required.fields" }));
      return;
    }

    setIsLoading(true);

    if (isEdit.current) {
      Fetch.put(`ptax/${dataToSave.id}`, { ...raw, id: dataToSave.id })
        .then(() => {
          const newData = data.map((ptax) => {
            if (ptax.id === dataToSave.id) {
              return { ...ptax, ...raw };
            }

            return ptax;
          });

          setData(newData);
          toast.success(intl.formatMessage({ id: "success.save" }));
          setSelectedPtax(null);
        })
        .catch((error) => {})
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      Fetch.post("ptax", raw)
        .then((response) => {
          setData((prev) => [...prev, response.data]);
          toast.success(intl.formatMessage({ id: "success.save" }));
          setSelectedPtax(null);
        })
        .catch((error) => {})
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  function handleDelete(id) {
    Fetch.delete(`ptax/${id}`)
      .then(() => {
        setData(data.filter((ptax) => ptax.id !== id));
        toast.success(intl.formatMessage({ id: "delete.success" }));
      })
      .catch((error) => {
        toast.error(intl.formatMessage({ id: "error.delete" }));
      });
  }

  function handleCloseModal() {
    isEdit.current = false;
    setSelectedPtax(null);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Row between="md" className="m-0">
            <TextSpan apparence="s1">PTax</TextSpan>
            <Button status="Primary" size="Small" onClick={handleNew}>
              {intl.formatMessage({ id: "new" })}
            </Button>
          </Row>
        </CardHeader>

        <CardBody>
          <Row>
            <PtaxTable
              data={data}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </Row>
        </CardBody>
      </Card>

      {!!selectedPtax && <PtaxAdd
        onClose={handleCloseModal}
        show
        data={selectedPtax}
        handleSave={handleSave}
      />}

      <SpinnerFull isLoading={isLoading} />
    </>
  );
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(PtaxList);
