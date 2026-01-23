import { nanoid } from "nanoid";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { TBODY, TD, TR } from "../../Table";
import {
  TextSpan,
} from "../../";
import { formatterMbKb, getDocumentFormat } from "../../Utils";
import LoadingRows from "./LoadingRows";
import { RenderFolder } from "./Utils";


const TBODYStyled = styled(TBODY)`
  tr {
    cursor: pointer;
  }
`

export const ListBody = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { isLoading, data } = props;

  return <>
    <TBODYStyled>
      {isLoading
        ? <LoadingRows key={nanoid(5)} />
        : <>
          {
            data?.data?.map((folder, index) => {
              return (folder?.documents?.length ? folder?.documents : [{ empty: true }])
                ?.map((document, indexDoc) => {
                  return (
                    <TR
                      isEvenColor={indexDoc % 2 === 0}
                      isEvenBorder={indexDoc === (document?.empty ? 1 : folder?.documents?.length) - 1 ? false : true}
                      key={nanoid(5)}
                    >
                      {indexDoc === 0 &&
                        RenderFolder(
                          folder,
                          document,
                          (item) => navigate(
                            `/view-folder?id=${item.id}`
                          ),
                          () => props.onOpenQRCode(folder)
                        )
                      }
                      <TD textAlign="start">
                        {document?.empty
                          ? <TextSpan apparence="p2" hint className="pl-2">
                            <FormattedMessage id="os.empty" />
                          </TextSpan>
                          : <TextSpan apparence="p2" className="pl-2">
                            {document?.name}
                          </TextSpan>}
                      </TD>


                      <TD textAlign="end">
                        <TextSpan apparence="p2" hint>
                          {getDocumentFormat(document?.format, intl)}
                        </TextSpan>
                      </TD>
                      <TD textAlign="end">
                        <TextSpan apparence="p2" hint className="mr-2">
                          {formatterMbKb(document?.size)}
                        </TextSpan>
                      </TD>
                      <TD textAlign="center">
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                        }}>

                          <TextSpan apparence="p3" hint>
                            {moment(document?.lastModifiedAt).format("DD,MMM YYYY")}
                          </TextSpan>
                          <TextSpan apparence="p3" hint>
                            {moment(document?.lastModifiedAt).format("HH:mm")}
                          </TextSpan>
                        </div>
                      </TD>
                    </TR>)
                })
            })
          }
        </>}
    </TBODYStyled >
  </>
}
