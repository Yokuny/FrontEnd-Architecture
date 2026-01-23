export const FailurePreliminarIndex = [
  { "name": "Vazamento de Oleo Lubrificante", "percentage": 30 },
  { "name": "Vazamento de Oleo combustivel", "percentage": 60 },
  { "name": "Alarme", "percentage": 15 },
  { "name": "Falha em turbina", "percentage": 30 },
  { "name": "Manutenção Preditiva", "percentage": 0 },
  { "name": "Manutenção Preventiva", "percentage": 0 },
  { "name": "Desvio de Manutenção Preditiva", "percentage": 15 },
  { "name": "Curto / Baixa de isolamento", "percentage": 50 },
  { "name": "Vazamento de gases", "percentage": 30 },
  { "name": "Intermitencia de sinal / comando", "percentage": 20 },
  { "name": "Shutdown", "percentage": 100 },
  { "name": "Falha catastrófica", "percentage": 100 },
  { "name": "Folga excessiva", "percentage": 30 },
  { "name": "Vazamento de agua", "percentage": 15 },
  { "name": "Travamento / grimpagem", "percentage": 50 },
  { "name": "Certificação", "percentage": 0 },
  { "name": "Falha Funcional", "percentage": 100 },
  { "name": "Desmobilização de ativo", "percentage": 0 },
  { "name": "Trincas e quebras", "percentage": 5 },
  { "name": "Limpeza", "percentage": 5 },
  { "name": "Melhoria de Projeto", "percentage": 0 },
  { "name": "Indicação / Sinal com dados incorretos", "percentage": 30 },
  { "name": "Perda de eficiencia", "percentage": 15 },
  { "name": "Testes de performance / Inspeção", "percentage": 0 },
  { "name": "Alta Vibração", "percentage": 40 },
  { "name": "Troca de Sub Componente Inoperante", "percentage": 20 },
  { "name": "Defasagem entre comando / feedback", "percentage": 15 },
  { "name": "Oxidação", "percentage": 5 },
  { "name": "Desgate estrutural", "percentage": 10 },
  { "name": "Contaminação de óleo", "percentage": 25 },
  { "name": "Rompimento de Cabos", "percentage": 15 },
  { "name": "Aumento de Temperatura", "percentage": 15 },
  { "name": "Aumento de Pressão", "percentage": 30 },
  { "name": "Baixa Pressão", "percentage": 20 }
]

export const getFailurePreliminarIndex = (typeFailure) => {
  const failure = FailurePreliminarIndex.find((failure) =>
    removeAccents(failure?.name) === removeAccents(typeFailure))
  return failure ? failure.percentage : 0
}

export const GroupConfiabilityIndex = [
  // {
  //   "name": "Sistema HVAC",
  //   "value": 67.00
  // },
  {
    "name": "Sistema Hidraulico",
    "value": 85.00
  },
  {
    "name": "Sistema de Fundeio / Ancoragem",
    "value": 70.00
  },
  {
    "name": "Sistema de Lastro",
    "value": 85.63
  },
  {
    "name": "Sistema de Resgate",
    "value": 90.00
  },
  {
    "name": "Sistemas de Navegação",
    "value": 83.07
  },
  {
    "name": "Sistema de Ar comprimido / Compressores",
    "value": 87.50
  },
  {
    "name": "Sistema Geração de Energia",
    "value": 92.17
  },
  {
    "name": "Motor Diesel Principal",
    "value": 95.00
  },
  {
    "name": "Motores a diesel",
    "value": 95.00
  },
  {
    "name": "Estrutura",
    "value": 95.78
  },
  {
    "name": "Sistema de Combate a incendio",
    "value": 98.00
  },
  {
    "name": "Iluminação",
    "value": 100.00
  },
  {
    "name": "Sistemas de internet / TV",
    "value": 100.00
  },
  {
    "name": "Caldeira",
    "value": 100.00
  },
  {
    "name": "Purificadores, Separadores e Bombas",
    "value": 100.00
  },
  {
    "name": "Propulsão Principal",
    "value": 100.00
  },
  {
    "name": "Sistema Sewage",
    "value": 100.00
  }
]

const removeAccents = (str) => {
  return str?.toLowerCase()?.trim()?.normalize("NFD")?.replace(/[\u0300-\u036f]/g, "")
}

export const findedGroupConfiabilityIndex = (typeFailure) => {
  return GroupConfiabilityIndex.find((group) =>
    removeAccents(group?.name) === removeAccents(typeFailure))
}

export const getGroupConfiabilityIndex = (typeFailure) => {
  const group = GroupConfiabilityIndex.find((group) =>
    removeAccents(group?.name) === removeAccents(typeFailure))
  return group ? group.value : 0
}
