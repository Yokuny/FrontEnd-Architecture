import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import moment from "moment";
import safetyQrCode from "../../assets/FilledListFas/safety_qrcode.jpg";

// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    paddingBottom: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: "auto",
  },
  titleBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  vesselBox: {
    width: 150,
    border: "0.5pt solid black",
    padding: 5,
    height: 40,
  },
  vesselLabel: {
    fontSize: 6,
    marginBottom: 2,
  },
  infoSection: {
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    border: "0.5pt solid black",
    borderBottom: "none",
  },
  infoRowLast: {
    flexDirection: "row",
    border: "0.5pt solid black",
  },
  infoCell: {
    flex: 1,
    padding: 3,
    borderRight: "0.5pt solid black",
    minHeight: 25,
  },
  infoCellLast: {
    flex: 1,
    padding: 3,
    minHeight: 25,
  },
  label: {
    fontSize: 6,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  value: {
    fontSize: 8,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    padding: 3,
    marginTop: 5,
  },
  cronologiaBox: {
    border: "0.5pt solid black",
  },
  cronologiaRow: {
    flexDirection: "row",
    borderBottom: "0.5pt solid black",
  },
  cronologiaCell: {
    flex: 1,
    padding: 3,
    borderRight: "0.5pt solid black",
  },
  cronologiaCellLast: {
    flex: 1,
    padding: 3,
  },
  table: {
    marginTop: 5,
    border: "0.5pt solid black",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottom: "0.5pt solid black",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5pt solid black",
    minHeight: 15,
  },
  tableCell: {
    padding: 2,
    borderRight: "0.5pt solid black",
    justifyContent: "center",
  },
  tableCellLast: {
    padding: 2,
    justifyContent: "center",
  },
  obsBox: {
    border: "0.5pt solid black",
    borderTop: "none",
    padding: 3,
    minHeight: 40,
  },
  maintTableCol1: {
    width: "25%",
  },
  maintTableCol2: {
    width: "35%",
  },
  maintTableCol3: {
    width: "10%",
  },
  maintTableCol4: {
    width: "30%",
  },
  rondaSection: {
    marginTop: 10,
  },
  rondaQuestion: {
    fontSize: 7,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  rondaOptions: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 5,
  },
  rondaOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 30,
  },
  checkbox: {
    width: 8,
    height: 8,
    border: "0.5pt solid black",
    marginRight: 4,
  },
  rondaLine: {
    borderBottom: "0.5pt solid black",
    marginTop: 20,
    width: "100%",
  },
  rondaFooter: {
    marginTop: 20,
    fontSize: 7,
  },
  qrCode: {
    width: 60,
    height: 60,
    marginTop: 10,
  },
  obsItemsBox: {
    marginTop: 20,
    border: "0.5pt solid black",
    padding: 5,
  },
  obsItemsTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 7,
  },
  obsItem: {
    fontSize: 6,
    marginBottom: 2,
  },
});

const FasTechnicalVisitPDF = ({ data }) => {
  const vesselName = data?.vessel?.name || "";
  const serviceDate = data?.serviceDate ? moment(data.serviceDate).format("DD/MM/YYYY") : "";
  const coordinatorName = ""; // User input usually
  const local = data?.local || "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0056b3", marginRight: 10 }}>CBO</Text>
          <View style={styles.titleBox}>
            <Text style={styles.title}>RELATÓRIO DE VISITA TÉCNICA</Text>
            <Text style={styles.subtitle}>COORDENADOR DE EMBARCAÇÃO</Text>
          </View>
          <View style={styles.vesselBox}>
            <Text style={styles.vesselLabel}>NOME DA EMBARCAÇÃO</Text>
            <Text style={styles.value}>{vesselName}</Text>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoCell}>
              <Text style={styles.label}>NOME DO COORDENADOR</Text>
              <Text style={styles.value}>{coordinatorName}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.label}>LOCAL</Text>
              <Text style={styles.value}>{local}</Text>
            </View>
            <View style={[styles.infoCellLast, { flex: 0.5 }]}>
              <Text style={styles.label}>DATA</Text>
              <Text style={styles.value}>{serviceDate}</Text>
            </View>
          </View>
          <View style={styles.infoRowLast}>
            <View style={styles.infoCell}>
              <Text style={styles.label}>NOME DO COMANDANTE</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.label}>NOME DO IMEDIATO QUE EMBARCA</Text>
            </View>
            <View style={styles.infoCellLast}>
              <Text style={styles.label}>NOME DO CHEMAQ QUE EMBARCA</Text>
            </View>
          </View>
        </View>

        {/* 1 - CRONOLOGIA DOS FATOS */}
        <Text style={styles.sectionTitle}>1 - CRONOLOGIA DOS FATOS</Text>
        <View style={styles.cronologiaBox}>
          <View style={styles.cronologiaRow}>
            <View style={styles.cronologiaCell}>
              <Text style={styles.label}>HORA DA CHEGADA</Text>
            </View>
            <View style={styles.cronologiaCell}>
              <Text style={styles.label}>HORA DA ATRACAÇÃO</Text>
            </View>
            <View style={styles.cronologiaCellLast}>
              <Text style={styles.label}>HORA DA SAÍDA</Text>
            </View>
          </View>
          <View style={{ padding: 3, minHeight: 60 }}>
            <Text style={styles.label}>OUTRAS INFORMAÇÕES</Text>
          </View>
        </View>
        <View style={{ padding: 3, minHeight: 20, border: "0.5pt solid black", marginTop: 10 }}>
          <Text style={styles.label}>PREVISÃO DE TÉRMINO</Text>
        </View>

        {/* 2 - ATENDIMENTO REALIZADOS E NÃO REALIZADOS */}
        <Text style={styles.sectionTitle}>2 - ATENDIMENTO REALIZADOS E NÃO REALIZADOS</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell, { width: "25%" }]}><Text style={{ textAlign: "center" }}>EMPRESA</Text></View>
            <View style={[styles.tableCell, { width: "35%" }]}><Text style={{ textAlign: "center" }}>EQUIPAMENTOS E/OU SERVIÇOS</Text></View>
            <View style={[styles.tableCell, { width: "10%", flexDirection: "row", padding: 0 }]}>
              <View style={{ flex: 1, alignItems: "center", borderRight: "0.5pt solid black", justifyContent: "center" }}><Text style={{ fontSize: 5 }}>SIM</Text></View>
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 5 }}>NÃO</Text></View>
            </View>
            <View style={[styles.tableCellLast, { width: "30%" }]}><Text style={{ textAlign: "center" }}>OBSERVAÇÕES</Text></View>
          </View>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((rowId) => (
            <View key={`row-atendimento-${rowId}`} style={styles.tableRow}>
              <View style={[styles.tableCell, { width: "25%" }]}></View>
              <View style={[styles.tableCell, { width: "35%" }]}></View>
              <View style={[styles.tableCell, { width: "10%", flexDirection: "row", padding: 0 }]}>
                <View style={{ flex: 1, borderRight: "0.5pt solid black" }}></View>
                <View style={{ flex: 1 }}></View>
              </View>
              <View style={[styles.tableCellLast, { width: "30%" }]}></View>
            </View>
          ))}
        </View>
        <View style={styles.obsBox}>
          <Text style={styles.label}>OBSERVAÇÕES</Text>
        </View>

        {/* 3 - PROGRAMA INSPEÇÃO DE MANUTENÇÃO */}
        <Text style={styles.sectionTitle}>3 - PROGRAMA INSPEÇÃO DE MANUTENÇÃO</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell, styles.maintTableCol1]}><Text style={{ textAlign: "center" }}>REGISTRO</Text></View>
            <View style={[styles.tableCell, styles.maintTableCol2]}><Text style={{ textAlign: "center" }}>EQUIPAMENTOS E/OU SERVIÇOS</Text></View>
            <View style={[styles.tableCell, styles.maintTableCol3, { flexDirection: "row", padding: 0 }]}>
              <View style={{ flex: 1, alignItems: "center", borderRight: "0.5pt solid black", justifyContent: "center" }}><Text style={{ fontSize: 5 }}>SIM</Text></View>
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 5 }}>NÃO</Text></View>
            </View>
            <View style={[styles.tableCellLast, styles.maintTableCol4]}><Text style={{ textAlign: "center" }}>OBSERVAÇÕES</Text></View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.maintTableCol1, { borderBottom: "none" }]}>
              <Text style={{ textAlign: "center", marginTop: 20 }}>Manutenção Planejada</Text>
            </View>
            <View style={{ width: "75%" }}>
              {[
                "Critical Nautical",
                "Critical Machines",
                "Bridge",
                "Deck",
                "Electric",
                "Machine",
                "E0"
              ].map((item) => (
                <View key={item} style={[styles.tableRow, { borderBottom: item === "E0" ? "none" : "0.5pt solid black" }]}>
                  <View style={[styles.tableCell, { width: "46.66%" }]}>
                    <Text>{item}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: "13.33%", flexDirection: "row", padding: 0 }]}>
                    <View style={{ flex: 1, borderRight: "0.5pt solid black" }}></View>
                    <View style={{ flex: 1 }}></View>
                  </View>
                  <View style={[styles.tableCellLast, { width: "40%" }]}></View>
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.tableRow, { borderTop: "0.5pt solid black" }]}>
            <View style={[styles.tableCell, styles.maintTableCol1]}><Text>Corretiva (Plano Correção Defeitos)</Text></View>
            <View style={[styles.tableCell, styles.maintTableCol2]}><Text>Todos</Text></View>
            <View style={[styles.tableCell, styles.maintTableCol3, { flexDirection: "row", padding: 0 }]}>
              <View style={{ flex: 1, borderRight: "0.5pt solid black" }}></View>
              <View style={{ flex: 1 }}></View>
            </View>
            <View style={[styles.tableCellLast, styles.maintTableCol4]}></View>
          </View>
        </View>
        <View style={styles.obsBox}>
          <Text style={styles.label}>OBSERVAÇÕES</Text>
        </View>

        {/* 4 - TRIPULAÇÃO */}
        <Text style={[styles.sectionTitle, { fontSize: 7, marginTop: 5 }]}>4 - TRIPULAÇÃO (informar abaixo qualquer ocorrência fora da programação)</Text>
        <View style={[styles.obsBox, { minHeight: 100, borderTop: "0.5pt solid black" }]}></View>

        {/* 5 - RONDA PRODUTIVA EM SEGURANÇA */}
        <Text style={styles.sectionTitle}>5 – RONDA PRODUTIVA EM SEGURANÇA</Text>
        <View style={styles.rondaSection}>
          <Text style={styles.rondaQuestion}>A RONDA PRODUTIVA FOI REALIZADA?</Text>
          <View style={styles.rondaOptions}>
            <View style={styles.rondaOption}>
              <View style={styles.checkbox} />
              <Text>SIM</Text>
            </View>
            <View style={styles.rondaOption}>
              <View style={styles.checkbox} />
              <Text>NÃO</Text>
            </View>
          </View>

          <Text style={styles.rondaQuestion}>FORAM ENCONTRADOS DESVIOS OU PONTOS DE MELHORIA?</Text>
          <View style={styles.rondaOptions}>
            <View style={styles.rondaOption}>
              <View style={styles.checkbox} />
              <Text>SIM</Text>
            </View>
            <View style={styles.rondaOption}>
              <View style={styles.checkbox} />
              <Text>NÃO</Text>
            </View>
          </View>

          <Text style={[styles.rondaQuestion, { fontWeight: "normal", marginBottom: 0 }]}>Se sim, descreva abaixo:</Text>
          <View style={styles.rondaLine} />
          <View style={styles.rondaLine} />
          <View style={styles.rondaLine} />

          <Text style={styles.rondaQuestion}>OS DESVIOS OU PONTOS DE MELHORIA FORAM TRATADOS DE IMEDIATO?</Text>
          <View style={styles.rondaOptions}>
            <View style={styles.rondaOption}>
              <View style={styles.checkbox} />
              <Text>SIM</Text>
            </View>
            <View style={styles.rondaOption}>
              <View style={styles.checkbox} />
              <Text>NÃO</Text>
            </View>
          </View>

          <View style={styles.rondaFooter}>
            <Text>Nota: comunicação de desvios e/ou sugestões podem ser realizados via chat do QSMS.</Text>
            <Text>Para isso bastar fazer a leitura do QR Code abaixo:</Text>
            {/* O QR Code deve ser colocado na pasta assets como safety_qrcode.png */}
            <Image style={styles.qrCode} src={safetyQrCode} />
          </View>

          <View style={styles.obsItemsBox}>
            <Text style={styles.obsItemsTitle}>Durante as rondas podem ser observados, entre outros pertinentes, os seguintes itens:</Text>
            <Text style={styles.obsItem}>- Corrimãos: Pontos de corrosão ou deficiência de fixação que possam comprometer sua funcionalidade ou integridade;</Text>
            <Text style={styles.obsItem}>- Escadas Verticais: Pontos de corrosão ou deficiência de fixação que possam comprometer sua funcionalidade ou integridade. Quando aplicável, certificar que o local de acesso está bloqueado com correntes, barras ou outros meios de controle;</Text>
            <Text style={styles.obsItem}>- Piso Gradeado: Integridade e correta fixação, inclusive dispondo de quatro grampos de fixação também íntegros e corretamente fixados;</Text>
            <Text style={styles.obsItem}>- Rodapé Contra Queda de Objetos: Livre de corrosão acentuada e instalado em altura compatível com o local de maneira a prevenir queda de objetos;</Text>
            <Text style={styles.obsItem}>- Equipamentos de Combate a Incêndio: Os equipamentos de combate a incêndio (extintores, mangueiras, machados etc.), estão em seu devido local e desobstruídos;</Text>
            <Text style={styles.obsItem}>- Sinalização de Segurança: Rotas de fuga e saídas de emergência livres e sinalizadas;</Text>
            <Text style={styles.obsItem}>- Sistema de Proteção Contra Quedas: Equipamentos e acessórios com risco de queda dispõem de sistema primário e secundário de prevenção contra quedas (cabos de segurança, coxim, porcas, parafusos de fixação etc.);</Text>
            <Text style={styles.obsItem}>- Base de Fixação dos Equipamentos: Integras em condições adequadas (sem corrosão, trincas);</Text>
            <Text style={styles.obsItem}>- Quinas e Partes Baixas: Sinalizadas, e quando aplicável, protegidas, prevenindo contato acidental;</Text>
            <Text style={styles.obsItem}>- Partes Móveis de Equipamentos: Proteções instaladas e sinalizadas;</Text>
            <Text style={styles.obsItem}>- Redes e Tubulações: Pintadas, sinalizadas e integras.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FasTechnicalVisitPDF;
