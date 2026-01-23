import styled from "styled-components";
import { TextSpan } from "../../../components";

const Badge = styled.div`
  padding: 1px 7px 2px 7px;
  border-radius: 4px;
`
const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const yearsFactor = [
  {
    year: 2023,
    factor: 5
  },
  {
    year: 2024,
    factor: 7
  },
  {
    year: 2025,
    factor: 9
  },
  {
    year: 2026,
    factor: 11
  },
  {
    year: 2027,
    factor: 13
  }
]

export const getFactorByYear = () => {
  return yearsFactor.find(x => x.year === new Date().getFullYear())?.factor || 0
}

export const getCIIRating = (dd, ciiAttained, ciiReq) => {
  const rating = ciiAttained / ciiReq;
  if (rating <= dd?.d1) {
    return "A"
  }
  if (rating <= dd?.d2) {
    return "B"
  }
  if (rating <= dd?.d3) {
    return "C"
  }
  if (rating <= dd?.d4) {
    return "D"
  }

  return "E"
}

export default function CIIRating(props) {
  const { dd, ciiAttained, ciiReq } = props;

  const styledAll = props.bordered ? {
    border: '1px solid #fff',
    ...(props.styleContent || {})
  } : {...(props.styleContent || {})}

  const apparence = props.apparence || "label";

  const getBadgeStatus = (dd, ciiAttained, ciiReq) => {
    const rating = ciiAttained / ciiReq;
    if (rating <= dd?.d1) {
      return <Badge style={{ backgroundColor: '#3366FF20', ...styledAll }}>
        <TextSpan apparence={apparence} style={{ color: '#3366FF' }}>A</TextSpan>
      </Badge>
    }
    if (rating <= dd?.d2) {
      return <Badge style={{ backgroundColor: '#00d68f20', ...styledAll }}>
        <TextSpan apparence={apparence} style={{ color: '#00d68f' }}>B</TextSpan>
      </Badge>
    }
    if (rating <= dd?.d3) {
      return <Badge style={{ backgroundColor: '#bcdd2220', ...styledAll }}>
        <TextSpan apparence={apparence} style={{ color: '#bcdd22' }}>C</TextSpan>
      </Badge>
    }
    if (rating <= dd?.d4) {
      return <Badge style={{ backgroundColor: '#ffaa0020', ...styledAll }}>
        <TextSpan apparence={apparence} style={{ color: '#ffaa00' }}>D</TextSpan>
      </Badge>
    }

    return <Badge style={{ backgroundColor: '#ff3d7120', ...styledAll }}>
      <TextSpan apparence={apparence} style={{ color: '#ff3d71' }}>E</TextSpan>
    </Badge>
  }

  return <>
    <Content>
      {getBadgeStatus(dd, ciiAttained, ciiReq)}
    </Content>
  </>
}
