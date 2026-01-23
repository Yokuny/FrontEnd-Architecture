import User from "@paljs/ui/User";
import styled, { css } from "styled-components";

export const UserImage = styled(User)`
  ${({ image, theme, isDisabled = false }) => css`
    .image {
      background-image: url(${image});
    }

    ${isDisabled && `
      .user-name {
        color: ${theme.textHintColor};
      }

      .user-picture {
        color: ${theme.textHintColor} !important;
      }

      .user-title {
        color: ${theme.textHintColor} !important;
      }
    `}

    .user-title {
        color: ${theme.textHintColor} !important;
      }
  `}
`;
