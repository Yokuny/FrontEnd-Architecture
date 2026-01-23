import { FormattedMessage } from "react-intl"
import { TextSpan } from "../../"
import { TH, THEAD, TRH } from "../../Table"

export const ListHeader = () => {
  return <>
    <THEAD>
      <TRH>
        <TH style={{ width: 160 }}>
          <TextSpan apparence="p2" className="pl-2" hint>
            <FormattedMessage id="folder" />
          </TextSpan>
        </TH>
        <TH style={{ width: 70 }}>
          <TextSpan apparence="p2" className="pl-2" hint>
            <FormattedMessage id="visibility" />
          </TextSpan>
        </TH>
        <TH textAlign="center" style={{ width: 120 }}>
          <TextSpan apparence="p2" hint className="pr-2">
            <FormattedMessage id="actions" />
          </TextSpan>
        </TH>
        <TH textAlign="start" style={{ width: 360 }}>
          <TextSpan apparence="p2" hint className="pl-2">
            <FormattedMessage id="document" />
          </TextSpan>
        </TH>
        <TH textAlign="center" style={{ width: 80 }}>
          <TextSpan apparence="p2" hint className="ml-2">
            <FormattedMessage id="document.type" />
          </TextSpan>
        </TH>
        <TH textAlign="end" style={{ width: 120 }}>
          <TextSpan apparence="p2" hint className="mr-2">
            <FormattedMessage id="size" />
          </TextSpan>
        </TH>
        <TH textAlign="center" style={{ width: 120 }}>
          <TextSpan apparence="p2" hint className="pl-2">
            <FormattedMessage id="last.date.acronym" />
          </TextSpan>
        </TH>
      </TRH>
    </THEAD>
  </>
}
