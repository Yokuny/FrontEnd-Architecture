import { Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui";
import { EvaIcon } from "@paljs/ui/Icon"
import { useEffect, useState } from "react";
import { Fetch, Modal } from "../../../components";
import { SkeletonThemed } from "../../../components/Skeleton";
import ViewForm from "./ViewForm";
import RVEConsumptionConsider from "./RVEConsumptionConsider";
import SidebarTimeline from "../../../components/FormTimeline/SidebarTimeline";

export default function ModalViewForm({
  isShow,
  onClose,
  title,
  formSelected,
  isRVE = false,
}) {
  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [typeForm, setTypeForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [formEvents, setFormEvents] = useState([]);


  useEffect(() => {
    if (formSelected) {
      getData(formSelected);
    }
  }, [formSelected]);

  const getData = async (formSelected) => {
    try {
      setIsLoading(true);
      const formDataPromise = Fetch.get(`/formdata?id=${formSelected?.id}`);
      const formConfigPromise = Fetch.get(
        `/form/mount?id=${formSelected?.idForm}`
      );

      const [response, response2] = await Promise.all([
        formDataPromise,
        formConfigPromise,
      ]);
      if (response.data) {
        const formData = response.data;
        setFormEvents(formData.events);
        setValues(formData);
      }
      if (response2.data) {
        setTypeForm(response2.data.typeForm)
        setFields(response2.data?.fields);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={isShow}
        size="ExtraLarge"
        styleContent={{ maxHeight: "calc(100vh - 250px)" }}
        onClose={onClose}
        title={title}
        renderHeaderButton={() => ["NOON_REPORT", "CMMS"].includes(typeForm) && (
          <Button
            className="mr-4 flex-between"
            appearance="ghost"
            size="Tiny"
            onClick={() => setShowTimeline(!showTimeline)}
          >
            <EvaIcon name="more-vertical-outline" />
            <FormattedMessage id="timeline" />
          </Button>
        )}
        renderFooter={isRVE ? () =>
          <RVEConsumptionConsider
            formData={values?.data}
            formSelected={formSelected}
          />
          : () => <></>}
      >
        <Row>
          {isLoading ? (
            <Col breakPoint={{ xs: 12 }}>
              <SkeletonThemed width={"100%"} height={40} />
              <div className="mt-2"></div>
              <SkeletonThemed width={"100%"} height={40} />
              <div className="mt-2"></div>
              <SkeletonThemed width={"100%"} height={40} />
              <div className="mt-2"></div>
              <SkeletonThemed width={"100%"} height={40} />
              <div className="mt-2"></div>
              <SkeletonThemed width={"100%"} height={40} />
            </Col>
          ) : (
            <ViewForm fields={fields} values={values} />
          )}
          {showTimeline &&
            <SidebarTimeline formEvents={formEvents} onClose={() => setShowTimeline(false)} />
          }
        </Row>
      </Modal>
    </>
  );
}
