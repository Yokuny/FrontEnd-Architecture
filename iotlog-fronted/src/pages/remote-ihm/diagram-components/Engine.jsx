import React from 'react';
import thruster_on from '../../../assets/img/thruster_on.svg';
import thruster_off from '../../../assets/img/thruster_off.svg';
import { styled } from 'styled-components';

const EngineStyle = styled.div`
    margin-top: -7px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    ${({ status }) => status === "1" && `color: #66c28c;`}
    ${({ isEditing }) => isEditing && `
        cursor: pointer;
        img {
            border: 2px dashed #a6a6a6;
            border-radius: 70px;
        }
    `}

    .rotate {
      animation: rotation 2s infinite linear;
    }

    @keyframes rotation {
      from {
          transform: rotate(0deg);
      }
      to {
          transform: rotate(360deg);
      }
  }
`

const Label = styled.span`
    font-size: 12px;
    font-weight: bold;
    text-wrap: nowrap;
    color: #a6a6a6;
    ${({ status }) => status === "1" && `color: #66c28c;`}
`

const Engine = ({ status, label, isEditing, onClick }) => {
  return (
    <EngineStyle status={status} isEditing={isEditing} onClick={onClick}>
      <img className={status === "1" && !isEditing ? 'rotate' : ''} src={status === "1" ? thruster_on : thruster_off} style={{ display: "inline-block", width: "140px", height: "140px" }} width="100%" />
      <Label status={status}>{label}</Label>
    </EngineStyle>
  );
};

export default Engine;
