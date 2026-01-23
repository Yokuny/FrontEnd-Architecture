import moment from "moment";

/**
 * Extrai uma linha específica da descrição da OS
 * @param {string} description - Descrição completa da OS
 * @param {string} linePrefix - Prefixo da linha a ser extraída (ex: "Resumo:", "Equipamento:")
 * @returns {string} - Texto extraído ou "-" se não encontrado
 */
export const extractLineFromDescription = (description, linePrefix) => {
  if (!description) return "-";
  
  const lines = description.split('\n');
  const targetLine = lines.find(line => line.trim().startsWith(`- ${linePrefix}:`));
  
  if (!targetLine) return "-";
  
  const extracted = targetLine.replace(`- ${linePrefix}:`, '').trim();
  return extracted || "-";
};

/**
 * Extrai apenas a linha "Resumo" da descrição da OS
 * @param {string} description - Descrição completa da OS
 * @returns {string} - Texto do resumo ou "-" se não encontrado
 */
export const extractResumeFromDescription = (description) => {
  return extractLineFromDescription(description, "Resumo");
};

/**
 * Extrai a linha "Equipamento" da descrição da OS
 * @param {string} description - Descrição completa da OS
 * @returns {string} - Texto do equipamento ou "" se não encontrado
 */
export const extractEquipmentFromDescription = (description) => {
  const equipment = extractLineFromDescription(description, "Equipamento");
  return equipment === "-" ? "" : equipment;
};

/**
 * Formata data para exibição no padrão DD/MM/YYYY HH:mm
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} - Data formatada
 */
export const formatRavitecDate = (date) => {
  if (!date) return "-";
  return moment(date).format('DD/MM/YYYY HH:mm');
};

/**
 * Formata data para exibição no PDF
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} - Data formatada para PDF
 */
export const formatRavitecDateForPDF = (date) => {
  if (!date) return "-";
  return moment(date).format('DD/MM/YYYY [às] HH:mm');
};

/**
 * Valida se pelo menos uma OS foi selecionada
 * @param {Array} selectedOrders - Array de IDs das OSs selecionadas
 * @returns {boolean} - True se válido
 */
export const validateStep1 = (selectedOrders) => {
  return selectedOrders && selectedOrders.length > 0;
};

/**
 * Valida se todos os campos do cabeçalho foram preenchidos
 * @param {Object} header - Dados do cabeçalho
 * @returns {boolean} - True se válido
 */
export const validateStep2 = (header) => {
  return !!(
    header &&
    header.vessel && 
    header.local && 
    header.serviceDate && 
    header.coordinator
  );
};

/**
 * Valida se todas as avaliações foram preenchidas corretamente
 * @param {Array} evaluations - Array de avaliações
 * @returns {boolean} - True se válido
 */
export const validateStep3 = (evaluations) => {
  if (!evaluations || evaluations.length === 0) return false;
  
  return evaluations.every(evaluation => {
    if (evaluation.satisfactory === false && (!evaluation.observations || evaluation.observations.trim() === '')) {
      return false;
    }
    
    const hasOrderName = evaluation.orderName && evaluation.orderName.trim() !== '';
    const hasEnterprise = evaluation.enterprise?.razao && evaluation.enterprise.razao.trim() !== '';
    const hasEquipment = evaluation.equipment && evaluation.equipment.trim() !== '';
    const hasSatisfactory = evaluation.satisfactory !== undefined && evaluation.satisfactory !== null;
    
    return hasOrderName && hasEnterprise && hasEquipment && hasSatisfactory;
  });
};

/**
 * Valida se os campos da etapa 4 foram preenchidos corretamente
 * @param {Object} generalObs - Dados das observações gerais
 * @returns {boolean} - True se válido
 */
export const validateStep4 = (generalObs) => {
  if (!generalObs) return false;
  
  if (generalObs.roundPerformed === undefined || generalObs.roundPerformed === null) {
    return false;
  }
  
  if (generalObs.deviationsFound === undefined || generalObs.deviationsFound === null) {
    return false;
  }
  
  if (generalObs.deviationsFound && (!generalObs.deviationsDescription || generalObs.deviationsDescription.trim() === '')) {
    return false;
  }
  
  if (generalObs.deviationsFound && (generalObs.deviationsTreated === undefined || generalObs.deviationsTreated === null)) {
    return false;
  }
  
  return true;
};

/**
 * Inicializa estrutura de avaliação para uma OS
 * @param {Object} order - Dados da OS
 * @returns {Object} - Estrutura de avaliação inicializada
 */
export const initializeEvaluation = (order) => {
  let equipment = extractEquipmentFromDescription(order.description);
  if (!equipment || equipment === "-" || equipment.trim() === "") {
    equipment = extractResumeFromDescription(order.description);
    if (equipment === "-") {
      equipment = "";
    }
  }
  
  return {
    orderId: order.id,
    orderName: order.name || "",
    orderIndex: order.index,
    enterprise: {
      razao: order.supplierData?.razao || "",
      cnpj: order.supplierData?.cnpj || ""
    },
    equipment: equipment,
    satisfactory: null,
    observations: ""
  };
};

/**
 * Formata CNPJ para exibição
 * @param {string} cnpj - CNPJ sem formatação
 * @returns {string} - CNPJ formatado
 */
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return "N/A";
  
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length === 14) {
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
  
  return cnpj;
};

/**
 * Gera nome do arquivo PDF
 * @param {string} vesselName - Nome da embarcação
 * @returns {string} - Nome do arquivo
 */
export const generatePDFFilename = (vesselName) => {
  const sanitizedVesselName = vesselName ? vesselName.replace(/[^a-z0-9]/gi, '_') : 'vessel';
  const timestamp = moment().format('YYYYMMDD_HHmmss');
  return `ravitec_${sanitizedVesselName}_${timestamp}.pdf`;
};
