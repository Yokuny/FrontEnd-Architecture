import { FormattedMessage } from "react-intl"
import { TextSpan } from "../../../../components"
import { TH, THEAD, TRH } from "../../../../components/Table"

export const HeaderTableList = () => {
  return <><THEAD>
    <TRH>
      <TH style={{ width: 280 }}>
        <TextSpan apparence="s2" className="pl-2" hint>
          FAS
        </TextSpan>
      </TH>
      <TH textAlign="center" style={{ width: 70 }}>
        <TextSpan apparence="p2" hint className="pr-2">
          <FormattedMessage id="actions" /> FAS
        </TextSpan>
      </TH>
      <TH textAlign="start" style={{ width: 120 }}>
        <TextSpan apparence="s2" hint className="pl-2">
          OS
        </TextSpan>
      </TH>
      <TH textAlign="center" style={{ width: 120 }}>
        <TextSpan apparence="s2" hint className="mr-2">
          <FormattedMessage id="status" />
        </TextSpan>
      </TH>
      <TH textAlign="start">
        <TextSpan apparence="s2" hint className="ml-2">
          <FormattedMessage id="supplier" />
        </TextSpan>
      </TH>
      <TH textAlign="start">
        <TextSpan apparence="s2" hint className="ml-2">
          <FormattedMessage id="planner" />
        </TextSpan>
      </TH>
      <TH textAlign="center" style={{ width: 70 }}>
        <TextSpan apparence="p2" hint className="pr-2">
          <FormattedMessage id="lighthouse" />
        </TextSpan>
      </TH>
      <TH textAlign="center" style={{ width: 70 }}>
        <TextSpan apparence="p2" hint className="pr-2">
          <FormattedMessage id="actions" /> OS
        </TextSpan>
      </TH>
    </TRH>
  </THEAD>
  </>
}
