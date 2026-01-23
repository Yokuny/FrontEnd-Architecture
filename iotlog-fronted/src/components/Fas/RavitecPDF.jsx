import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatRavitecDateForPDF, formatCNPJ } from './Utils/RavitecHelpers';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  
  header: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottom: '2pt solid #000',
    paddingBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    width: 130,
    minWidth: 130,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerRight: {
    border: '1pt solid #000',
    padding: 5,
    width: 130,
    minWidth: 130,
    flexShrink: 0,
    minHeight: 40,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  logoImage: {
    width: 120,
    height: 40,
    objectFit: 'contain',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
  },
  boxLabel: {
    fontSize: 7,
    marginBottom: 2,
  },
  
  infoGrid: {
    border: '1pt solid #000',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  infoRowLast: {
    flexDirection: 'row',
  },
  infoCell: {
    padding: 4,
    borderRight: '1pt solid #000',
    minHeight: 20,
  },
  infoCellLast: {
    padding: 4,
    minHeight: 20,
  },
  cellLabel: {
    fontSize: 7,
    textTransform: 'uppercase',
    marginBottom: 3,
    fontWeight: 'normal',
  },
  cellValue: {
    fontSize: 9,
    lineHeight: 1.3,
  },
  
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  
  // Safety info section (separate from Section 3)
  safetySection: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '2pt solid #000',
  },
  safetySectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  safetyInfoBox: {
    border: '1pt solid #000',
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  safetyInfoTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  safetyInfoText: {
    fontSize: 7,
    lineHeight: 1.6,
  },
  
  table: {
    border: '1pt solid #000',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderBottom: '1pt solid #000',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 3,
    borderRight: '1pt solid #000',
    fontSize: 8,
  },
  tableCellLast: {
    padding: 3,
    fontSize: 8,
  },
  tableCellSmall: {
    width: '8%',
  },
  tableCellMedium: {
    width: '15%',
  },
  tableCellLarge: {
    width: '30%',
  },
  
  // Evaluation styles
  evaluationBox: {
    border: '1pt solid #000',
    marginBottom: 8,
    padding: 6,
  },
  evaluationHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
    borderBottom: '1pt solid #ccc',
    paddingBottom: 3,
  },
  evaluationRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  evaluationLabel: {
    width: '30%',
    fontSize: 8,
    fontWeight: 'bold',
  },
  evaluationValue: {
    width: '70%',
    fontSize: 8,
  },
  satisfactoryYes: {
    color: '#00a000',
    fontWeight: 'bold',
  },
  satisfactoryNo: {
    color: '#d00000',
    fontWeight: 'bold',
  },
  
  observationsBox: {
    border: '1pt solid #000',
    padding: 5,
    marginTop: 5,
    backgroundColor: '#f9f9f9',
  },
  observationsLabel: {
    fontSize: 7,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  observationsText: {
    fontSize: 8,
  },
  
  footer: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 7,
    color: '#666',
    borderTop: '1pt solid #ccc',
    paddingTop: 5,
  },
});

const RavitecPDF = ({ data }) => {
  const { header, selectedOrdersDetails, evaluations, generalObservations, enterpriseLogo } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {enterpriseLogo ? (
              <Image src={enterpriseLogo} style={styles.logoImage} />
            ) : (
              <Text style={styles.logo}>CBO</Text>
            )}
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>RELATÓRIO DE VISITA TÉCNICA</Text>
            <Text style={styles.subtitle}>COORDENADOR DE EMBARCAÇÃO</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.boxLabel}>NOME DA EMBARCAÇÃO</Text>
            <Text style={styles.cellValue}>{header.vessel || '-'}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <View style={[styles.infoCell, { width: '33%' }]}>
              <Text style={styles.cellLabel}>Nome do Coordenador</Text>
              <Text style={styles.cellValue}>{header.coordinator || '-'}</Text>
            </View>
            <View style={[styles.infoCell, { width: '34%' }]}>
              <Text style={styles.cellLabel}>Local</Text>
              <Text style={styles.cellValue}>{header.local || '-'}</Text>
            </View>
            <View style={[styles.infoCellLast, { width: '33%' }]}>
              <Text style={styles.cellLabel}>Data</Text>
              <Text style={styles.cellValue}>{formatRavitecDateForPDF(header.serviceDate)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          1 - ORDENS DE SERVIÇO SELECIONADAS ({selectedOrdersDetails?.length || 0})
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableCellSmall]}>N°</Text>
            <Text style={[styles.tableCell, styles.tableCellMedium]}>JOB</Text>
            <Text style={[styles.tableCell, styles.tableCellMedium]}>OS</Text>
            <Text style={[styles.tableCellLast, styles.tableCellLarge]}>Fornecedor</Text>
          </View>
          {selectedOrdersDetails && selectedOrdersDetails.map((order, index) => {
            const isLast = index === selectedOrdersDetails.length - 1;
            return (
              <View key={order.id} style={isLast ? styles.tableRowLast : styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellSmall]}>{order.index}</Text>
                <Text style={[styles.tableCell, styles.tableCellMedium]}>{order.job || '-'}</Text>
                <Text style={[styles.tableCell, styles.tableCellMedium]}>{order.name}</Text>
                <Text style={[styles.tableCellLast, styles.tableCellLarge]}>
                  {order.supplierData?.razao || 'N/A'}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>
          2 - ATENDIMENTO REALIZADOS E NÃO REALIZADOS
        </Text>
        {evaluations && evaluations.map((evaluation, index) => (
          <View key={evaluation.orderId} style={styles.evaluationBox} wrap={false}>
            <Text style={styles.evaluationHeader}>
              {evaluation.orderName || `OS #${evaluation.orderIndex}`}
            </Text>
            
            <View style={styles.evaluationRow}>
              <Text style={styles.evaluationLabel}>EMPRESA:</Text>
              <Text style={styles.evaluationValue}>
                {evaluation.enterprise?.razao || 'N/A'}
              </Text>
            </View>
            
            {evaluation.enterprise?.cnpj && (
              <View style={styles.evaluationRow}>
                <Text style={styles.evaluationLabel}>CNPJ:</Text>
                <Text style={styles.evaluationValue}>
                  {formatCNPJ(evaluation.enterprise.cnpj)}
                </Text>
              </View>
            )}
            
            <View style={styles.evaluationRow}>
              <Text style={styles.evaluationLabel}>EQUIPAMENTO E/OU SERVIÇOS:</Text>
              <Text style={styles.evaluationValue}>{evaluation.equipment || '-'}</Text>
            </View>
            
            <View style={styles.evaluationRow}>
              <Text style={styles.evaluationLabel}>SATISFATÓRIO:</Text>
              <Text style={[
                styles.evaluationValue, 
                evaluation.satisfactory ? styles.satisfactoryYes : styles.satisfactoryNo
              ]}>
                {evaluation.satisfactory ? 'SIM' : 'NÃO'}
              </Text>
            </View>
            
            {evaluation.observations && (
              <View style={styles.observationsBox}>
                <Text style={styles.observationsLabel}>Observações:</Text>
                <Text style={styles.observationsText}>{evaluation.observations}</Text>
              </View>
            )}
          </View>
        ))}

        <View wrap={false} break={evaluations && evaluations.length > 5}>
          <Text style={styles.sectionTitle}>
            3 - RONDA PRODUTIVA EM SEGURANÇA
          </Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <View style={[styles.infoCellLast, { width: '100%', paddingTop: 8, paddingBottom: 8 }]}>
                <Text style={[styles.cellLabel, { fontSize: 9, fontWeight: 'bold', marginBottom: 6 }]}>
                  A RONDA PRODUTIVA FOI REALIZADA?
                </Text>
                <Text style={[styles.cellValue, { fontSize: 10, marginLeft: 10 }]}>
                  ( {generalObservations.roundPerformed ? 'X' : ' '} ) SIM     ( {!generalObservations.roundPerformed && generalObservations.roundPerformed !== null ? 'X' : ' '} ) NÃO
                </Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={[styles.infoCellLast, { width: '100%', paddingTop: 8, paddingBottom: 8 }]}>
                <Text style={[styles.cellLabel, { fontSize: 9, fontWeight: 'bold', marginBottom: 6 }]}>
                  FORAM ENCONTRADOS DESVIOS OU PONTOS DE MELHORIA?
                </Text>
                <Text style={[styles.cellValue, { fontSize: 10, marginLeft: 10 }]}>
                  ( {generalObservations.deviationsFound ? 'X' : ' '} ) SIM     ( {!generalObservations.deviationsFound && generalObservations.deviationsFound !== null ? 'X' : ' '} ) NÃO
                </Text>
              </View>
            </View>
            
            {generalObservations.deviationsFound && generalObservations.deviationsDescription && (
              <View style={styles.infoRow}>
                <View style={[styles.infoCellLast, { width: '100%', paddingTop: 8, paddingBottom: 8 }]}>
                  <Text style={[styles.cellLabel, { fontSize: 9, fontWeight: 'bold', marginBottom: 6 }]}>
                    SE SIM, DESCREVA ABAIXO:
                  </Text>
                  <Text style={[styles.cellValue, { fontSize: 9, marginLeft: 10 }]}>
                    {generalObservations.deviationsDescription}
                  </Text>
                </View>
              </View>
            )}
            
            {generalObservations.deviationsFound && (
              <View style={styles.infoRowLast}>
                <View style={[styles.infoCellLast, { width: '100%', paddingTop: 8, paddingBottom: 8 }]}>
                  <Text style={[styles.cellLabel, { fontSize: 9, fontWeight: 'bold', marginBottom: 6 }]}>
                    OS DESVIOS OU PONTOS DE MELHORIA FORAM TRATADOS DE IMEDIATO?
                  </Text>
                  <Text style={[styles.cellValue, { fontSize: 10, marginLeft: 10 }]}>
                    ( {generalObservations.deviationsTreated ? 'X' : ' '} ) SIM     ( {!generalObservations.deviationsTreated && generalObservations.deviationsTreated !== null ? 'X' : ' '} ) NÃO
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.safetySection} wrap={false}>
          <View style={styles.safetyInfoBox}>
            <Text style={styles.safetyInfoTitle}>
              DURANTE AS RONDAS PODEM SER OBSERVADOS, ENTRE OUTROS PERTINENTES, OS SEGUINTES ITENS:
            </Text>
            <Text style={styles.safetyInfoText}>
              {'\n'}- Corrimãos: Pontos de corrosão ou deficiência de fixação que possam comprometer sua funcionalidade ou integridade;
              {'\n\n'}- Escadas Verticais: Pontos de corrosão ou deficiência de fixação que possam comprometer sua funcionalidade ou integridade. Quando aplicável, certificar que o local de acesso está bloqueado com correntes, barras ou outros meios de controle;
              {'\n\n'}- Piso Gradeado: Integridade e correta fixação, inclusive dispondo de quatro grampos de fixação também íntegros e corretamente fixados;
              {'\n\n'}- Rodapé Contra Queda de Objetos: Livre de corrosão acentuada e instalado em altura compatível com o local de maneira a prevenir queda de objetos;
              {'\n\n'}- Equipamentos de Combate a Incêndio: Os equipamentos de combate a incêndio (extintores, mangueiras, machados etc.), estão em seu devido local e desobstruídos;
              {'\n\n'}- Sinalização de Segurança: Rotas de fuga e saídas de emergência livres e sinalizadas;
              {'\n\n'}- Sistema de Proteção Contra Quedas: Equipamentos e acessórios com risco de queda dispõem de sistema primário e secundário de prevenção de quedas (cabos de segurança, coxim, porcas, parafusos de fixação etc.);
              {'\n\n'}- Base de Fixação dos Equipamentos: Íntegras em condições adequadas (sem corrosão, trincas);
              {'\n\n'}- Quinas e Partes Baixas: Sinalizadas, e quando aplicável, protegidas, prevenindo contato acidental;
              {'\n\n'}- Partes Móveis de Equipamentos: Proteções instaladas e sinalizadas;
              {'\n\n'}- Redes e Tubulações: Pintadas, sinalizadas e íntegras.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            RAVITEC gerado em {formatRavitecDateForPDF(new Date())} | IOTLog by Bykonz
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default RavitecPDF;
