export const RULES: Record<string, { rules: string[]; observation?: string }> = {
  dp: {
    rules: ['<= 500M da plataforma', '<= 900M da plataforma e <= 1 nós'],
    observation: 'Se houver sensor de telemetria, o DP é obtido diretamente dele.',
  },
  standby: {
    rules: ['>= 500M e <= 2500M da plataforma e <= 2.6 nós'],
  },
  underway: {
    rules: ['> 4 nós e <= 2.6 nós'],
  },
  fasttransit: {
    rules: ['> 11 nós'],
  },
  slow: {
    rules: ['<= 4 nós'],
    observation: 'Dentro da Baía de Guanabara',
  },
  at_anchor: {
    rules: ['<= 1.9 nós'],
    observation: 'Dentro de uma cerca do tipo Fundeio',
  },
  port: {
    rules: ['<= 1 nós'],
    observation: 'Dentro de uma cerca do tipo Porto',
  },
  dock: {
    rules: ['<= 1 nós'],
    observation: 'Dentro de uma cerca do tipo Docagem',
  },
};
