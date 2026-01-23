import React, { useState, useEffect } from "react";
import { CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { EvaIcon, Tab, Tabs } from "@paljs/ui";
import Row from "@paljs/ui/Row";
import { toast } from "react-toastify";
import { pdf } from '@react-pdf/renderer';
import moment from "moment";
import { Modal } from "../";
import Step1SelectOrders from "./RavitecSteps/Step1SelectOrders";
import Step2Header from "./RavitecSteps/Step2Header";
import Step3Evaluation from "./RavitecSteps/Step3Evaluation";
import Step4GeneralObservations from "./RavitecSteps/Step4GeneralObservations";
import Step5Review from "./RavitecSteps/Step5Review";
import RavitecPDF from "./RavitecPDF";
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  initializeEvaluation,
  generatePDFFilename
} from "./Utils/RavitecHelpers";

const ModalRavitec = ({ show, onClose, fasData, orders, enterpriseLogo }) => {
  const intl = useIntl();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [ravitecData, setRavitecData] = useState({
    selectedOrders: [],
    header: {
      vessel: "",
      local: "",
      serviceDate: "",
      coordinator: ""
    },
    evaluations: [],
    generalObservations: {
      roundPerformed: null,
      deviationsFound: null,
      deviationsDescription: "",
      deviationsTreated: null
    }
  });

  useEffect(() => {
    if (show && fasData) {
      const getUserName = () => {
        try {
          const userString = localStorage.getItem("user");
          if (userString) {
            const user = JSON.parse(userString);
            return user?.name || "";
          }
        } catch (e) {
          return "";
        }
      };

      setRavitecData(prev => ({
        ...prev,
        header: {
          vessel: fasData.vessel?.name || "",
          local: fasData.local || "",
          serviceDate: fasData.serviceDate || moment().format("YYYY-MM-DDTHH:mm:ssZ"),
          coordinator: getUserName()
        }
      }));
    }
  }, [show, fasData]);

  useEffect(() => {
    if (ravitecData.selectedOrders.length > 0 && orders) {
      const selectedOrdersData = orders.filter(order => 
        ravitecData.selectedOrders.includes(order.id)
      );

      const newEvaluations = selectedOrdersData.map(order => {
        const existingEval = ravitecData.evaluations.find(e => e.orderId === order.id);
        
        if (existingEval) {
          return existingEval;
        } else {
          return initializeEvaluation(order);
        }
      });

      setRavitecData(prev => ({
        ...prev,
        evaluations: newEvaluations
      }));
    } else {
      setRavitecData(prev => ({
        ...prev,
        evaluations: []
      }));
    }
  }, [ravitecData.selectedOrders, orders]);

  const handleClose = () => {
    setRavitecData({
      selectedOrders: [],
      header: {
        vessel: "",
        local: "",
        serviceDate: "",
        coordinator: ""
      },
      evaluations: [],
      generalObservations: {
        roundPerformed: null,
        deviationsFound: null,
        deviationsDescription: "",
        deviationsTreated: null
      }
    });
    setActiveIndex(0);
    onClose();
  };

  const handleSelectionChange = (selectedIds) => {
    setRavitecData(prev => ({
      ...prev,
      selectedOrders: selectedIds
    }));
  };

  const handleHeaderChange = (header) => {
    setRavitecData(prev => ({
      ...prev,
      header
    }));
  };

  const handleEvaluationChange = (evaluations) => {
    setRavitecData(prev => ({
      ...prev,
      evaluations
    }));
  };

  const handleGeneralObsChange = (generalObs) => {
    setRavitecData(prev => ({
      ...prev,
      generalObservations: generalObs
    }));
  };

  const canGoNext = () => {
    switch (activeIndex) {
      case 0:
        return validateStep1(ravitecData.selectedOrders);
      case 1:
        return validateStep2(ravitecData.header);
      case 2:
        return validateStep3(ravitecData.evaluations);
      case 3:
        return validateStep4(ravitecData.generalObservations);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canGoNext()) {
      toast.error(intl.formatMessage({ id: "ravitec.validation.error", defaultMessage: "Por favor, preencha todos os campos obrigatórios" }));
      return;
    }
    
    if (activeIndex < 4) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setIsLoading(true);
      
      const selectedOrdersDetails = orders.filter(order => 
        ravitecData.selectedOrders.includes(order.id)
      );

      const pdfData = {
        ...ravitecData,
        selectedOrdersDetails,
        enterpriseLogo
      };

      const blob = await pdf(<RavitecPDF data={pdfData} />).toBlob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        generatePDFFilename(ravitecData.header.vessel)
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(intl.formatMessage({ id: 'ravitec.success', defaultMessage: 'Relatório RAVITEC gerado com sucesso!' }));
      handleClose();
    } catch (error) {
      toast.error(intl.formatMessage({ id: 'ravitec.error', defaultMessage: 'Erro ao gerar relatório RAVITEC' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({ id: "ravitec.modal.title", defaultMessage: "Gerar RAVITEC" })}
      onClose={handleClose}
      styleContent={{ 
        maxHeight: "calc(100vh - 200px)", 
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%"
      }}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            <div>
              {activeIndex < 4 ? (
                <Button
                  size="Small"
                  status="Primary"
                  className="flex-between"
                  onClick={handleNext}
                  disabled={!canGoNext() || isLoading}
                >
                  <FormattedMessage id="next" defaultMessage="Próximo" />
                  <EvaIcon name="arrow-forward-outline" className="ml-1" />
                </Button>
              ) : (
                <Button
                  size="Small"
                  status="Success"
                  className="flex-between"
                  onClick={handleGeneratePDF}
                  disabled={isLoading}
                >
                  <EvaIcon name="download-outline" className="mr-1" />
                  {isLoading ? (
                    <FormattedMessage id="ravitec.generating" defaultMessage="Gerando..." />
                  ) : (
                    <FormattedMessage id="ravitec.generate" defaultMessage="Gerar RAVITEC" />
                  )}
                </Button>
              )}
            </div>
          </Row>
        </CardFooter>
      )}
    >
      <Tabs activeIndex={activeIndex} onSelect={(i) => setActiveIndex(i)}>
        <Tab
          title={intl.formatMessage({ id: "ravitec.step1.title", defaultMessage: "1. SELEÇÃO DAS OSs" })}
          disabled={false}
        >
          <Step1SelectOrders
            orders={orders || []}
            selectedOrders={ravitecData.selectedOrders}
            onSelectionChange={handleSelectionChange}
          />
        </Tab>
        
        <Tab 
          title={intl.formatMessage({ id: "ravitec.step2.title", defaultMessage: "2. CONFIRMAÇÃO DO CABEÇALHO" })}
          disabled={!validateStep1(ravitecData.selectedOrders)}
        >
          <Step2Header
            header={ravitecData.header}
            onHeaderChange={handleHeaderChange}
          />
        </Tab>
        
        <Tab 
          title={intl.formatMessage({ id: "ravitec.step3.title", defaultMessage: "3. AVALIAÇÃO DOS ATENDIMENTOS" })}
          disabled={!validateStep1(ravitecData.selectedOrders) || !validateStep2(ravitecData.header)}
        >
          <Step3Evaluation
            evaluations={ravitecData.evaluations}
            onEvaluationChange={handleEvaluationChange}
            orders={orders || []}
          />
        </Tab>
        
        <Tab 
          title={intl.formatMessage({ id: "ravitec.step4.title", defaultMessage: "4. OBSERVAÇÕES GERAIS E RONDA" })}
          disabled={
            !validateStep1(ravitecData.selectedOrders) || 
            !validateStep2(ravitecData.header) || 
            !validateStep3(ravitecData.evaluations)
          }
        >
          <Step4GeneralObservations
            generalObs={ravitecData.generalObservations}
            onGeneralObsChange={handleGeneralObsChange}
          />
        </Tab>
        
        <Tab 
          title={intl.formatMessage({ id: "ravitec.step5.title", defaultMessage: "5. REVISÃO FINAL" })}
          disabled={
            !validateStep1(ravitecData.selectedOrders) || 
            !validateStep2(ravitecData.header) || 
            !validateStep3(ravitecData.evaluations) ||
            !validateStep4(ravitecData.generalObservations)
          }
        >
          <Step5Review
            ravitecData={ravitecData}
            orders={orders || []}
          />
        </Tab>
      </Tabs>
    </Modal>
  );
};

export default ModalRavitec;
