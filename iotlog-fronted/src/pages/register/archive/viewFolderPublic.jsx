import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardBody } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Fetch,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import FolderHeader from "../../../components/Archive/FolderView/FolderHeader";
import FolderDetailsPublic from "../../../components/Archive/FolderView/Public/FolderDetailsPublic";
import { EvaIcon } from "@paljs/ui";

const ViewFolderPublic = (props) => {
  const [data, setData] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const idFolder = searchParams.get("id");

  React.useEffect(() => {
    if (idFolder) {
      getData(idFolder);
    }
  }, [idFolder])

  const getData = async (idFolder, showLoading = true) => {
    if (!idFolder) return;
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const response = await Fetch.get(`/public-folder/find?id=${idFolder}`);
      setData(response.data);
    }
    catch (e) {
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }

  const onRefresh = async (folder = undefined) => {
    if (folder) {
      setSearchParams({ id: folder.id });
    }
  }

  return (
    <React.Fragment>
      <Card>
        <FolderHeader
          onBack={() => navigate("/login")}
          data={data}
          getData={() => getData(idFolder, false)}
          messageId={"back.login"}
        />
        <CardBody>
          <Row center="xs">
            {data ? <FolderDetailsPublic
              data={data}
              onRefresh={onRefresh}
            /> :
              <>
                <EvaIcon name="slash-outline" className="mr-2" status="Danger" />
                <TextSpan>
                  <FormattedMessage id="permission.denied" />
                </TextSpan>
              </>}
          </Row>
        </CardBody>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </React.Fragment>
  );
};

export default ViewFolderPublic;
