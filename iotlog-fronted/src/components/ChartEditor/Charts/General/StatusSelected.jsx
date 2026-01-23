import { FormattedMessage } from "react-intl";
import styled, { css, useTheme } from "styled-components";
import { connect } from "react-redux";
import TextSpan from "../../../Text/TextSpan";
import { getIcon } from "../../../../pages/fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background-color: ${({ theme, color }) => `${color}10`};
  margin-bottom: -13px;
  color: ${({ theme }) =>
		theme?.colorControlDefault || theme?.colorBasic100 || "#e2e8f0"};
`;

const IconRounded = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
  `}
`;

const StatusSelected = (props) => {
	const {
		filterStatusConsume,
		dataStatusConsume
	} = props;

	const theme = useTheme();

	const status = dataStatusConsume?.find((item) =>
		filterStatusConsume?.includes(item?.status)
	);

	return (
		<>
			{status ? (
				<StatusRow>
					<StatusPill
						color={getIcon(status.status, theme, true, { width: 22, height: 22 }).bgColor}
					>
						<IconRounded>
							{
								getIcon(status.status, theme, true, { width: 22, height: 22 })
									.component
							}
						</IconRounded>
						<TextSpan apparence="s2"
							style={{
								color: getIcon(status.status, theme, true, { width: 22, height: 22 }).bgColor
							}}
						>
							<FormattedMessage id={getIcon(status.status)?.text} />
						</TextSpan>
					</StatusPill>
				</StatusRow>
			) : null}
		</>
	);
};

const mapStateToProps = (state) => ({
	dataStatusConsume: state.chartData.dataStatusConsume,
	filterStatusConsume: state.chartData.filterStatusConsume,
});


export default connect(mapStateToProps, undefined)(StatusSelected);
