import React from 'react';
import { styled } from 'styled-components';
import ModalIHMInfo from '../ModalIHMInfo';
import { useState } from 'react';
import { isInt } from '../../../components/Utils';
import { InputGroup } from '@paljs/ui';
import { useIntl } from 'react-intl';

const IHMInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #a6a6a6;
  min-width: 170px;
  height: 100px;
  flex-grow: 1;
  align-self: center;
  border: 1px solid black;
  border-radius: 6px;
  -webkit-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  -moz-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  font-weight: bold;
  ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
`

const InfoGroup = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: bold;
  line-height: 1.2;
  text-wrap: nowrap;
  padding: 0 8px;
  width: 100%;
  span:first-child {
    flex-grow: 1;
  }
  justify-content: flex-end;
  gap: 4px;
  span:nth-child(3) {
    min-width: 35px;
  }
`

const IHMInfo = ({ infoList, isEditing, labelEditable=false, onChange, onChangeLabel, idMachine, sensorList, label }) => {

  const intl = useIntl();
  const [showModalInfo, setShowModalInfo] = useState(false)

  const handleOnConfirmInfo = (infoList) => {
    onChange(infoList)
  }

  const handleChangeInfo = (e) => {
    if (isEditing && e.target.tagName !== "INPUT") {
      setShowModalInfo(true)
    }
  }

  return (
    <>
      <IHMInfoContainer isEditing={isEditing} onClick={(e) => handleChangeInfo(e)}>
        {isEditing && labelEditable ?
              <InputGroup fullWidth>
                <input
                  value={label}
                  onChange={(e) => onChangeLabel(e.target.value)}
                  type="text"
                  placeholder={intl.formatMessage({ id: "description" })}
                />
              </InputGroup>
          :
          <span className="mb-1">{label || 'MBB'}</span>
        }
        {infoList?.map((info) =>
          <InfoGroup>
            <span>{info.label}</span>
            <span>{isInt(info.value) ? info.value : info.value?.toFixed(2)}</span>
            <span>{info.unit}</span>
          </InfoGroup>
        )}
      </IHMInfoContainer>
      <ModalIHMInfo
        show={showModalInfo}
        onClose={() => setShowModalInfo(false)}
        onChange={handleOnConfirmInfo}
        infoList={infoList ?? []}
        idMachine={idMachine}
        sensorList={sensorList}
      />
    </>
  );
};

export default IHMInfo;
