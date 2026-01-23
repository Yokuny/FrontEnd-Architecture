import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

// Estilos
const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 6,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  titleBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 8,
    fontWeight: "bold",
    fontStyle: "italic",
    textAlign: "center",
  },
  headerInfoBox: {
    width: 170,
    border: "0.5pt solid black",
  },
  headerInfoRow: {
    flexDirection: "row",
    borderBottom: "0.5pt solid black",
    minHeight: 11,
  },
  headerInfoRowLast: {
    flexDirection: "row",
    minHeight: 11,
  },
  headerInfoLabel: {
    width: 50,
    fontSize: 6,
    fontWeight: "bold",
    padding: 2,
    borderRight: "0.5pt solid black",
    justifyContent: "center",
  },
  headerInfoValue: {
    flex: 1,
    fontSize: 7,
    padding: 2,
    color: "black",
    textAlign: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 6.5,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    flexWrap: "wrap",
  },
  fieldGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginRight: 15,
    marginBottom: 5,
  },
  label: {
    fontSize: 7,
    fontWeight: "bold",
    marginRight: 3,
  },
  underline: {
    borderBottom: "0.5pt solid black",
    minWidth: 80,
    paddingBottom: 1,
    alignItems: "center",
  },
  value: {
    fontSize: 6.5,
    color: "black",
  },
  descBox: {
    border: "0.5pt solid black",
    minHeight: 30,
    padding: 3,
    marginTop: 0,
    marginBottom: 5,
  },
  descLabel: {
    fontSize: 7,
    fontWeight: "bold",
    marginBottom: 2,
  },
  blueHeader: {
    backgroundColor: "#0056b3",
    color: "white",
    flexDirection: "row",
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 11,
    borderBottom: "0.5pt solid black",
  },
  table: {
    border: "0.5pt solid black",
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0056b3",
    color: "white",
    fontWeight: "bold",
    minHeight: 11,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "0.5pt solid black",
    minHeight: 11,
  },
  tableCell: {
    padding: 1,
    borderRight: "0.5pt solid black",
    justifyContent: "center",
    textAlign: "center",
  },
  tableCellLast: {
    padding: 1,
    justifyContent: "center",
    textAlign: "center",
  },
  commentBox: {
    border: "0.5pt solid black",
    minHeight: 97,
    padding: 3,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  signatureBox: {
    width: "32%",
    border: "0.5pt solid black",
    padding: 4,
    minHeight: 80,
  },
  signatureLabel: {
    fontSize: 6,
    fontWeight: "bold",
    marginBottom: 2,
  },
  signatureLine: {
    borderBottom: "0.5pt solid black",
    marginTop: 15,
    marginBottom: 2,
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
    fontSize: 5,
    color: "gray",
    textAlign: "right",
  },
});

const formatDate = (date, format = "DD/MM/YYYY") => {
  if (!date) return "";
  const momentDate = moment(date);
  return momentDate.isValid() ? momentDate.format(format) : "";
};

const formatTime = (date) => {
  if (!date) return "";
  const momentDate = moment(date);
  return momentDate.isValid() ? momentDate.format("HH:mm") : "";
};

const getDayOfWeek = (date) => {
  if (!date) return "";
  const momentDate = moment(date);
  if (!momentDate.isValid()) return "";

  const days = {
    Sunday: "Domingo",
    Monday: "Segunda-feira",
    Tuesday: "Terça-feira",
    Wednesday: "Quarta-feira",
    Thursday: "Quinta-feira",
    Friday: "Sexta-feira",
    Saturday: "Sábado",
  };

  return days[momentDate.format("dddd")] || momentDate.format("dddd");
};

const FasTimesheetPDF = ({ orderData }) => {
  if (!orderData) orderData = {};

  const local = orderData.local || orderData.fasHeader?.local || "";
  const vesselName = orderData.fasHeader?.vessel?.name || "";
  const supplierName = orderData.supplierData?.razao || "";
  const supplierCnpj = orderData.supplierData?.cnpj || "";
  const serviceDate = orderData.serviceDate || orderData.fasHeader?.serviceDate;

  // Processar colaboradores
  const collaborators = (orderData.collaborators || []).map((collab) => ({
    nomeColaborador: collab.name || "",
    funcao: collab.role || "",
    servico: {
      diaSemana: getDayOfWeek(serviceDate),
      dataEntrada: formatDate(serviceDate),
      horaEntrada: formatTime(serviceDate),
    },
  }));

  // Helper para renderizar linhas vazias se necessário
  const renderEmptyRows = (count, startFrom = 0) => {
    const rows = [];
    for (let i = startFrom; i < count; i++) {
      rows.push(null);
    }
    return rows;
  };

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#0056b3" }}>
            CBO
          </Text>
          <View style={styles.titleBox}>
            <Text style={styles.title}>RELATÓRIO DE ATENDIMENTO</Text>
            <Text style={[styles.subtitle, { color: "black" }]}>TIME SHEET</Text>
          </View>
          <View style={styles.headerInfoBox}>
            <View style={styles.headerInfoRow}>
              <Text style={styles.headerInfoLabel}>Razão Social</Text>
              <Text style={styles.headerInfoValue}>{supplierName}</Text>
            </View>
            <View style={styles.headerInfoRowLast}>
              <Text style={styles.headerInfoLabel}>CNPJ:</Text>
              <Text style={styles.headerInfoValue}>{supplierCnpj}</Text>
            </View>
          </View>
        </View>

        {/* 1 - DETALHAMENTO DA SOLICITAÇÃO */}
        <Text style={styles.sectionTitle}>
          *1 - DETALHAMENTO DA SOLICITAÇÃO:
        </Text>
        <View style={styles.fieldRow}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>OS de Serviço:</Text>
            <View style={[styles.underline, { minWidth: 60 }]}>
              <Text style={styles.value}>{orderData.name || ""}</Text>
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>TIPO:</Text>
            <View style={[styles.underline, { minWidth: 80 }]}>
              <Text style={styles.value}>
                {orderData.fasHeader?.type || ""}
              </Text>
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>EMBARCAÇÃO:</Text>
            <View style={[styles.underline, { minWidth: 100 }]}>
              <Text style={styles.value}>{vesselName}</Text>
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>LOCAL:</Text>
            <View style={[styles.underline, { minWidth: 100 }]}>
              <Text style={styles.value}>{local}</Text>
            </View>
          </View>
        </View>

        <View style={styles.descBox}>
          <Text style={styles.descLabel}>Descrição:</Text>
          <View>
            <Text style={[styles.value, { fontSize: 6.5 }]}>
              {orderData.description || ""}
            </Text>
          </View>
        </View>

        {/* 2 - REGISTRO DE CRONOLOGIA (ATENDIMENTO) */}
        <Text style={styles.sectionTitle}>
          *2- REGISTRO DE CRONOLOGIA (ATENDIMENTO)
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* Tabela Esquerda: Colaborador + IDA */}
          <View style={[styles.table, { width: "59%" }]}>
            {/* Header Row 1 */}
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.tableCell,
                  {
                    width: "23%",
                    backgroundColor: "#0056b3",
                    borderBottom: "none",
                    color: "white",
                    fontWeight: "bold",
                  },
                ]}
              >
                <Text style={{ marginTop: 5 }}>Nome do Colaborador</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  {
                    width: "16%",
                    backgroundColor: "#0056b3",
                    borderBottom: "none",
                    color: "white",
                    fontWeight: "bold",
                  },
                ]}
              >
                <Text style={{ marginTop: 5 }}>Função</Text>
              </View>
              <View
                style={[
                  styles.tableCell,
                  {
                    width: "61%",
                    backgroundColor: "#0056b3",
                    color: "white",
                    padding: 2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={{ fontSize: 7, fontWeight: "bold" }}>
                  Deslocamento IDA (Validado time de Terra)
                </Text>
              </View>
            </View>

            {/* Header Row 2 */}
            <View style={styles.tableHeader}>
              <View
                style={[styles.tableCell, { width: "23%", borderTop: "none" }]}
              />
              <View
                style={[styles.tableCell, { width: "16%", borderTop: "none" }]}
              />
              <Text
                style={[styles.tableCell, { width: "10.16%", fontSize: 5 }]}
              >
                Rota (de)
              </Text>
              <Text
                style={[styles.tableCell, { width: "10.16%", fontSize: 5 }]}
              >
                Rota (para)
              </Text>
              <Text
                style={[styles.tableCell, { width: "10.16%", fontSize: 5 }]}
              >
                Data de Saída
              </Text>
              <Text
                style={[styles.tableCell, { width: "10.16%", fontSize: 5 }]}
              >
                Hora de Saída
              </Text>
              <Text
                style={[styles.tableCell, { width: "10.18%", fontSize: 5 }]}
              >
                Data de Chegada
              </Text>
              <Text
                style={[styles.tableCellLast, { width: "10.18%", fontSize: 5 }]}
              >
                Hora de Chegada
              </Text>
            </View>

            {[
              ...collaborators,
              ...renderEmptyRows(10, collaborators.length),
            ].map((collab, index) => (
              <View key={`row-left-${index}`} style={[styles.tableRow, index === 9 ? { borderBottom: "none" } : {}]}>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "23%", color: "black", fontSize: 6 },
                  ]}
                >
                  {collab?.nomeColaborador || ""}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "16%", color: "black", fontSize: 6 },
                  ]}
                >
                  {collab?.funcao || ""}
                </Text>
                <View style={[styles.tableCell, { width: "10.16%" }]} />
                <View style={[styles.tableCell, { width: "10.16%" }]} />
                <View style={[styles.tableCell, { width: "10.16%" }]} />
                <View style={[styles.tableCell, { width: "10.16%" }]} />
                <View style={[styles.tableCell, { width: "10.18%" }]} />
                <View style={[styles.tableCellLast, { width: "10.18%" }]} />
              </View>
            ))}
          </View>

          {/* Tabela Direita: VOLTA */}
          <View style={[styles.table, { width: "39%" }]}>
            {/* Header Row 1 */}
            <View
              style={[
                styles.blueHeader,
                { padding: 2, borderBottom: "0.5pt solid black" },
              ]}
            >
              <Text style={{ fontSize: 7, fontWeight: "bold" }}>
                Deslocamento Volta (Validado time de Terra)
              </Text>
            </View>

            {/* Header Row 2 */}
            <View style={styles.tableHeader}>
              <Text
                style={[styles.tableCell, { width: "16.66%", fontSize: 5 }]}
              >
                Rota (de)
              </Text>
              <Text
                style={[styles.tableCell, { width: "16.66%", fontSize: 5 }]}
              >
                Rota (para)
              </Text>
              <Text
                style={[styles.tableCell, { width: "16.66%", fontSize: 5 }]}
              >
                Data de Saída
              </Text>
              <Text
                style={[styles.tableCell, { width: "16.66%", fontSize: 5 }]}
              >
                Hora de Saída
              </Text>
              <Text
                style={[styles.tableCell, { width: "16.66%", fontSize: 5 }]}
              >
                Data de Chegada
              </Text>
              <Text
                style={[styles.tableCellLast, { width: "16.7%", fontSize: 5 }]}
              >
                Hora de Chegada
              </Text>
            </View>

            {[
              ...collaborators,
              ...renderEmptyRows(10, collaborators.length),
            ].map((_, index) => (
              <View key={`row-right-${index}`} style={[styles.tableRow, index === 9 ? { borderBottom: "none" } : {}]}>
                <View style={[styles.tableCell, { width: "16.66%" }]} />
                <View style={[styles.tableCell, { width: "16.66%" }]} />
                <View style={[styles.tableCell, { width: "16.66%" }]} />
                <View style={[styles.tableCell, { width: "16.66%" }]} />
                <View style={[styles.tableCell, { width: "16.66%" }]} />
                <View style={[styles.tableCellLast, { width: "16.7%" }]} />
              </View>
            ))}
          </View>
        </View>

        {/* Tabela Serviço */}
        <View style={styles.table}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={[
                styles.tableCell,
                { width: "10%", backgroundColor: "#0056b3" },
              ]}
            ></View>
            <View
              style={[
                styles.tableCell,
                { width: "8%", backgroundColor: "#0056b3" },
              ]}
            ></View>
            <View
              style={[
                styles.tableCell,
                {
                  width: "63%",
                  backgroundColor: "#0056b3",
                  color: "white",
                  padding: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Text style={{ fontSize: 7, fontWeight: "bold" }}>
                Serviço - (Validado pelo time de Bordo)
              </Text>
            </View>
            <View
              style={[
                styles.tableCell,
                { width: "5%", backgroundColor: "#0056b3" },
              ]}
            ></View>
            <View
              style={[
                styles.tableCell,
                { width: "5%", backgroundColor: "#0056b3" },
              ]}
            ></View>
            <View
              style={[
                styles.tableCellLast,
                { width: "9%", backgroundColor: "#0056b3" },
              ]}
            ></View>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { width: "10%", color: "white" }]}>
              Nome do Colaborador
            </Text>
            <Text style={[styles.tableCell, { width: "8%", color: "white" }]}>
              Função
            </Text>
            {/* SERVICO */}
            <Text
              style={[styles.tableCell, { width: "12.6%", color: "white" }]}
            >
              Dia da Semana
            </Text>
            <Text
              style={[styles.tableCell, { width: "12.6%", color: "white" }]}
            >
              Data Entrada
            </Text>
            <Text
              style={[styles.tableCell, { width: "12.6%", color: "white" }]}
            >
              Hora Entrada
            </Text>
            <Text
              style={[styles.tableCell, { width: "12.6%", color: "white" }]}
            >
              Data Saída
            </Text>
            <Text
              style={[styles.tableCell, { width: "12.6%", color: "white" }]}
            >
              Hora Saída
            </Text>
            {/* REFEICOES */}
            <Text
              style={[
                styles.tableCell,
                { width: "5%", color: "white", fontSize: 5 },
              ]}
            >
              Almoço CBO S/N
            </Text>
            <Text
              style={[
                styles.tableCell,
                { width: "5%", color: "white", fontSize: 5 },
              ]}
            >
              Janta CBO S/N
            </Text>
            <Text
              style={[
                styles.tableCellLast,
                { width: "9%", color: "white", fontSize: 6 },
              ]}
            >
              OBSERVAÇÕES
            </Text>
          </View>

          {[...collaborators, ...renderEmptyRows(10, collaborators.length)].map(
            (collab, index) => (
              <View key={`row-servico-${index}`} style={[styles.tableRow, index === 9 ? { borderBottom: "none" } : {}]}>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "10%", color: "black", fontSize: 6 },
                  ]}
                >
                  {collab?.nomeColaborador || ""}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "8%", color: "black", fontSize: 6 },
                  ]}
                >
                  {collab?.funcao || ""}
                </Text>
                <View style={[styles.tableCell, { width: "12.6%" }]}>
                  <Text style={{ color: "black", fontSize: 6 }}>
                    {collab?.servico?.diaSemana || ""}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "12.6%" }]}>
                  <Text style={{ color: "black", fontSize: 6 }}>
                    {collab?.servico?.dataEntrada || ""}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "12.6%" }]}>
                  <Text style={{ color: "black", fontSize: 6 }}>
                    {collab?.servico?.horaEntrada || ""}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "12.6%" }]} />
                <View style={[styles.tableCell, { width: "12.6%" }]} />
                <View style={[styles.tableCell, { width: "5%" }]} />
                <View style={[styles.tableCell, { width: "5%" }]} />
                <View style={[styles.tableCellLast, { width: "9%" }]} />
              </View>
            )
          )}
        </View>

        {/* 3 e 4 - ABERTURA DE PT e COMENTÁRIOS */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* 3 - ABERTURA DE PT */}
          <View style={{ width: "25%" }}>
            <Text style={styles.sectionTitle}>
              3- ABERTURA DE PT (SE APLICÁVEL)
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "30%", fontSize: 5, color: "white" },
                  ]}
                >
                  TST Responsável
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "15%", fontSize: 5, color: "white" },
                  ]}
                >
                  Data
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "20%", fontSize: 5, color: "white" },
                  ]}
                >
                  Horário de Solicitação
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { width: "20%", fontSize: 5, color: "white" },
                  ]}
                >
                  Horário de Liberação
                </Text>
                <Text
                  style={[
                    styles.tableCellLast,
                    { width: "15%", fontSize: 5, color: "white" },
                  ]}
                >
                  Visto TST
                </Text>
              </View>
              {[1, 2, 3, 4, 5, 6, 7].map((i, index) => (
                <View key={`pt-${i}`} style={[styles.tableRow, index === 7 ? { borderBottom: "none" } : {}]}>
                  <View style={[styles.tableCell, { width: "30%" }]} />
                  <View style={[styles.tableCell, { width: "15%" }]} />
                  <View style={[styles.tableCell, { width: "20%" }]} />
                  <View style={[styles.tableCell, { width: "20%" }]} />
                  <View style={[styles.tableCellLast, { width: "15%" }]} />
                </View>
              ))}
            </View>
          </View>

          {/* 4 - COMENTÁRIOS */}
          <View style={{ width: "74%" }}>
            <Text style={styles.sectionTitle}>
              *4- COMENTÁRIOS (Resumo dos serviços realizados e/ou problemas p
              execução) / OBSERVAÇÕES / MATERIAL UTILIZADO
            </Text>
            <View style={styles.commentBox}>
              {/* Espaço em branco para preenchimento manual ou dinâmico */}
            </View>
          </View>
        </View>

        {/* 5 e 6 - ASSINATURAS */}
        <View style={styles.signatureSection}>
          {/* 5 - CBO BORDO */}
          <View style={styles.signatureBox}>
            <Text
              style={[styles.signatureLabel, { textTransform: "uppercase" }]}
            >
              *5- Assinatura, nome por extenso, cargo e carimbo do responsável
              pela embarcação/equipe terra cbo
            </Text>
            <Text style={styles.signatureLabel}>Nome:</Text>
            <Text style={{ fontSize: 7, fontWeight: "bold" }}>
              (time BORDO)
            </Text>
            <Text style={[styles.signatureLabel, { marginTop: 5 }]}>
              Assinatura:
            </Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>
              Local e Data: _________/_________/_________
            </Text>
          </View>

          {/* 5 - CBO TERRA */}
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Nome:</Text>
            <Text style={{ fontSize: 7, fontWeight: "bold" }}>
              (time TERRA)
            </Text>
            <Text style={[styles.signatureLabel, { marginTop: 5 }]}>
              Assinatura:
            </Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>
              Local e Data: _________/_________/_________
            </Text>
          </View>

          {/* 6 - FORNECEDOR */}
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>
              *6- ASSINATURA E NOME POR EXTENSO FORNECEDOR
            </Text>
            <Text style={styles.signatureLabel}>Nome:</Text>
            <Text style={{ fontSize: 7, fontWeight: "bold" }}>
              (FORNECEDOR)
            </Text>
            <Text style={[styles.signatureLabel, { marginTop: 5 }]}>
              Assinatura:
            </Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>
              Local e Data: _________/_________/_________
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Estado da OS: {orderData.state || "N/A"} | Empresa:{" "}
          {orderData.fasHeader?.enterprise?.name || "N/A"} | Gerado em:{" "}
          {formatDate(new Date())} {formatTime(new Date())}
        </Text>
      </Page>
    </Document>
  );
};

export default FasTimesheetPDF;
