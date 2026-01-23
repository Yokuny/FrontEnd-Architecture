import * as React from "react";
import { connect } from "react-redux";
import { Card, CardBody } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { EvaIcon } from "@paljs/ui/Icon"
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Fetch,
  SpinnerFull,
} from "../../../components";
import FolderDetails from "../../../components/Archive/FolderView/FolderDetails";
import FolderHeader from "../../../components/Archive/FolderView/FolderHeader";
import ModalAddDocument from "../../../components/Archive/ModalAddDocument";
import OptionsButton from "./OptionsButton";

const FolderView = (props) => {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAddDocumentrModal, setShowAddDocumentModal] = React.useState(false);

  const folderId = searchParams.get("id");

  const navigate = useNavigate();

  React.useEffect(() => {
    if (folderId) {
      getData(folderId);
    }
  }, [folderId])

  const onCloseAddDocumentModal = () => {
    setShowAddDocumentModal(false);
    onRefresh();
  }

  const getData = async (folderId, showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const response = await Fetch.get(`/folder/find?id=${folderId}`);
      setData(response.data ? response.data : []);
    }
    catch (e) {
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }

  const onRefresh = async (folder = undefined) => {
    if (folder?.id) {
      setSearchParams({ id: folder.id });
    }
  }

  return (
    <React.Fragment>
      <Card>
        <FolderHeader
          data={data}
          getData={getData}
          onBack={() => navigate(-1)}
        >
          <OptionsButton
            data={data}
            items={props.items}
            onRefresh={onRefresh}
          />
        </FolderHeader>
        <CardBody>
          <Row between="xs">
            <FolderDetails
              data={data}
              items={props.items}
              onRefresh={onRefresh}
              setIsLoading={setIsLoading}
            />
          </Row>
          {!isLoading && <Row middle="xs" center="xs" className="m-0">
            <Button
              size="Tiny"
              status="Info"
              appearance="ghost"
              disabled={isLoading}
              className="flex-between ml-2"
              onClick={() => setShowAddDocumentModal(true)}>
              <EvaIcon name="plus-square-outline" className="mr-1" />
              <FormattedMessage id="add.document" />
            </Button>
          </Row>}
          <ModalAddDocument
            show={showAddDocumentrModal}
            setIsLoading={setIsLoading}
            onClose={onCloseAddDocumentModal}
            folderId={data?.id}
          />
        </CardBody>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(FolderView);
