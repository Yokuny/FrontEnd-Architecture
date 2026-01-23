import { Col, Row } from "@paljs/ui";
import React from "react";
import { connect } from 'react-redux';
import { Fetch } from "../../../components";
import { SkeletonThemed } from "../../../components/Skeleton";
import ContentItem from "../Item";
import { setForm } from "../../../actions";

const MountFormFields = (props) => {
  const { data, onChange, idForm } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [formDetails, setFormDetails] = React.useState();

  React.useEffect(() => {
    if (idForm)
      getData(idForm);

    return () => {
      props.setForm(undefined)
      setFormDetails(undefined)
    }
  }, [idForm]);

  const getData = (id) => {
    setIsLoading(true);
    Fetch.get(`/form/mount?id=${id}`)
      .then((response) => {
        props.setForm(response.data);
        setFormDetails(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <>
        <div className="ml-4 mt-4" style={{ width: "95%" }}>
          <Row>
            <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
              <SkeletonThemed width={"100%"} />
            </Col>
            <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
              <SkeletonThemed width={"100%"} />
            </Col>
            <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
              <SkeletonThemed width={"100%"} />
            </Col>
            <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
              <SkeletonThemed width={"100%"} />
            </Col>
          </Row>
          <Row>
            <Col breakPoint={{ md: 6, is: 6 }} className="mb-4">
              <SkeletonThemed width={"100%"} />
            </Col>
            <Col breakPoint={{ md: 6, is: 6 }} className="mb-4">
              <SkeletonThemed width={"100%"} />
            </Col>
          </Row>
          <Row>
            <Col breakPoint={{ md: 4, is: 6 }} className="mb-4">
              <SkeletonThemed width={"100%"} />
            </Col>
            <Col breakPoint={{ md: 4, is: 6 }} className="mb-4">
              <SkeletonThemed width={"100%"} />
            </Col>
            <Col breakPoint={{ md: 4, is: 6 }} className="mb-4">
              <SkeletonThemed width={"100%"} />
            </Col>
          </Row>
        </div>
      </>
    );
  }

  return (
    <>
      {formDetails?.fields?.map((x, i) => (
        <ContentItem
          key={`${i}-${x.name}`}
          data={data}
          field={x}
          onChange={onChange}
        />
      ))}
    </>
  );
}

const mapDispatchToProps = (dispatch) => ({
  setForm: (form) => {
    dispatch(setForm(form));
  },
});

export default connect(undefined, mapDispatchToProps)(MountFormFields)
