import { TR, TRH, TH, TD, TABLE, TBODY, THEAD } from "../../Table";
import { nanoid } from "nanoid";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import {
    TextSpan,
} from "../../";
import { RenderFolder } from "../ListTable/Utils";

const TBODYStyled = styled(TBODY)`
  tr {
    cursor: pointer;
  }
`

export default function AttatchedFolders({ data, items, onRefresh }) {
    const intl = useIntl();
    return (
        <TABLE className="mb-4" style={{ borderCollapse: 'collapse' }}>
            <THEAD>
                <TRH>
                    <TH>
                        <TextSpan apparence="s2" className="pl-2" hint>
                            <FormattedMessage id="attatched.folder" />
                        </TextSpan>
                    </TH>
                    <TH textAlign="center">
                        <TextSpan apparence="s2" className="pl-2" hint>
                            <FormattedMessage id="visibility" />
                        </TextSpan>
                    </TH>

                    <TH textAlign="center" style={{ width: 70 }}>
                        <TextSpan apparence="p2" hint className="pr-2">
                            <FormattedMessage id="actions" />
                        </TextSpan>
                    </TH>
                    <TH textAlign="start" style={{ width: 360 }}>
                        <TextSpan apparence="s2" hint className="pl-2">
                            <FormattedMessage id="document" />
                        </TextSpan>
                    </TH>
                </TRH>
            </THEAD>
            <TBODYStyled>
                {data?.map((folder, index) => {
                    return (folder?.documents?.length ? folder?.documents : [{ empty: true }])
                        ?.map((document, indexDoc) => {
                            return (< TR
                                isEvenColor={indexDoc % 2 === 0}
                                isEvenBorder={indexDoc === (document?.empty ? 1 : folder?.documents?.length) - 1 ? false : true}
                                key={nanoid(5)}>
                                {indexDoc === 0 &&
                                    RenderFolder(folder, document, onRefresh)
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
                            </TR >)

                        })
                })}
            </TBODYStyled>
        </TABLE>
    )
}