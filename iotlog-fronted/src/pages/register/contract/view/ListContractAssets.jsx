import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, CardFooter, Row, Col, Card, CardHeader, CardBody, EvaIcon } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { CardNoShadow, Fetch, SpinnerFull } from "../../../../components";
import { useNavigate } from "react-router-dom";
import AddContractAsset from "./AddContractAsset";

const ListContractAssets = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [contractAssetsToDelete, setContractAssetsToDelete] = useState([]);
  const [idContract, setIdContract] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    verifyEdit();
  }, []);

  const verifyEdit = () => {
    const idEdit = new URL(window.location.href).searchParams.get("id");
    if (!!idEdit) {
      getEditEntity(idEdit);
    }
  };

  const getEditEntity = (id) => {
    setIsLoading(true);
    setIdContract(id);
    Fetch.get(`/contract/findContractAssets?id=${id}`)
      .then((response) => {
        if (response.data) {
          let contractAssets = response.data?.contractAssets?.map((ca) => {
            if (ca?.id)
              return ({
                ...ca,
                dateInit: new Date(ca.dateInit),
                dateEnd: new Date(ca.dateEnd),
                typeAsset: ca.typeAsset,
                machine: {
                  value: ca?.idMachine,
                  label: ca?.machineName,
                }
              })
          });
          contractAssets = contractAssets.filter((e) => e !== undefined)
          if (contractAssets.length === 0)
            contractAssets = [{}]
          setData({
            ...response.data,
            contractAssets
          })
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  const onChangeItemContractAsset = (index, prop, value) => {
    let contractAssetUpdate = data.contractAssets[index];

    contractAssetUpdate[prop] = value;
    setData({
      ...data,
      contractAssets: [
        ...data.contractAssets.slice(0, index),
        contractAssetUpdate,
        ...data.contractAssets.slice(index + 1),
      ],
    });
  };

  const onSave = () => {
    if (data.contractAssets?.some((ca) => !ca?.machine)) {
      toast.warn(intl.formatMessage({ id: "machine.required" }));
      return;
    }
    if (data.contractAssets?.some((ca) => !ca?.dateInit)) {
      toast.warn(intl.formatMessage({ id: "date.init.required" }));
      return;
    }

    if (data.contractAssets
      ?.some((ca) => !!ca?.dateInit && !!ca?.dateEnd && new Date(ca?.dateInit) > new Date(ca?.dateEnd))) {
      toast.warn(intl.formatMessage({ id: "date.end.is.before.date.start" }));
      return;
    }

    let contractAssets = data.contractAssets.map((ca) => {
      if (ca?.machine && ca?.dateInit)
        return ({
          id: ca?.id,
          idContract,
          idMachine: ca?.machine?.value,
          dateInit: ca?.dateInit ? new Date(ca?.dateInit) : null,
          dateEnd: ca?.dateEnd ? new Date(ca?.dateEnd) : null,
          enterpriseName: ca?.enterpriseName,
          typeAsset: ca?.typeAsset,
          daily: ca?.daily,
        })
    })
    contractAssets = contractAssets.filter((e) => e !== undefined)
    Fetch.put("/contract-asset", { contractAssets, contractAssetsToDelete })
      .then(() => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        navigate(-1);
      })

  }

  return (
    <>
      <Card>
        <CardHeader>
          <FormattedMessage id="view.contract.asset" />
        </CardHeader>
        <CardBody className="mb-0">
          <Row>
            <Col breakPoint={{ xs: 12, md: 12 }}>
              {data.contractAssets?.map((contractAsset, i) => (
                <CardNoShadow
                  className="mt-4 mb-4"
                  key={`${i}-contractAsset`}>
                  <CardBody className="p-1">
                    <AddContractAsset
                      idEnterprise={data?.idEnterprise}
                      contractAssetItem={contractAsset}
                      onChangeItem={(prop, value) => onChangeItemContractAsset(i, prop, value)}
                      onRemove={() => {
                        setContractAssetsToDelete([...contractAssetsToDelete, contractAsset])
                        onChange(
                          "contractAssets",
                          data.contractAssets?.filter((x, z) => z != i)
                        )
                      }}
                    />
                  </CardBody>
                </CardNoShadow>
              ))}
            </Col>
            <Col breakPoint={{ xs: 12, md: 12 }}>
            <Row center="xs">
              <Button
                size="Tiny"
                status="Success"
                className={`flex-between ml-4`}
                onClick={() => {
                  if (data.contractAssets?.length) {
                    onChange("contractAssets", [...data.contractAssets, {}]);
                    return;
                  }
                  onChange("contractAssets", [{}]);
                }}
              >
                <EvaIcon name="plus-circle-outline" className="mr-1" />
                <FormattedMessage id="add.machine" />
              </Button>
            </Row>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Row end="xs" className="ml-1 mr-1">
            <Button size="Small" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  )
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps)(ListContractAssets);
