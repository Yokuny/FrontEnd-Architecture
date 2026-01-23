import React from 'react';
import Modal from '../../../../components/Modal';
import { TABLE, TBODY, TH, THEAD, TRH, TR, TD } from '../../../../components/Table';
import { TextSpan } from '../../../../components';
import { FormattedMessage } from 'react-intl';

const ModalChartDetails = ({ show, onClose, data }) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="form"
      size="ExtraLarge"
      styleContent={{
        maxHeight: "calc(90vh - 220px)",
        overflowX: "hidden",
        overflowY: "auto"
      }}
    >
      <TABLE>
        <THEAD>
          <TRH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="vessel" />
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="code" />
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="type" />
              </TextSpan>
            </TH>
            <TH textAlign="center" style={{ width: '50%' }}>
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="order.scope" />
              </TextSpan>
            </TH>
          </TRH>
        </THEAD>
        <TBODY>
          {data?.map((item, index) => (
            <TR 
              key={`item-${index}`}
              isEvenColor={index % 2 === 0}
              isEvenBorder={index % 2 === 0}
            >
              <TD textAlign="center">
                <TextSpan apparence="p2">
                  {item.assetName || item.embarcacao || '-'}
                </TextSpan>
              </TD>
              <TD textAlign="center">
                <TextSpan apparence="p2">
                  {item.codigoOS || '-'}
                </TextSpan>
              </TD>
              <TD textAlign="center">
                <TextSpan apparence="p2">
                  {item.tipoManutencao || '-'}
                </TextSpan>
              </TD>
              <TD textAlign="center">
                <TextSpan apparence="p2">
                  {item.escopodoservico || '-'}
                </TextSpan>
              </TD>
            </TR>
          ))}
        </TBODY>
      </TABLE>
    </Modal>
  );
};

export default ModalChartDetails; 