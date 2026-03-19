# Documentação de Ícones

Este documento fornece um guia para uso, localização e aplicação em casos de uso gerais de todos os ícones disponíveis no diretório `@/components/icons`.

## Como Importar e Usar

Todos os ícones estão disponíveis no diretório `@/components/icons`. Eles são exportados nativamente via `export default`, o que significa que podem ser importados com o nome que você preferir - embora a melhor prática seja manter a convenção do mesmo nome do arquivo (sem a extensão `.Icon`).

```tsx
// Exemplo de importação
import Loader from '@/components/icons/Loader.Icon';
import Add from '@/components/icons/Add.Icon';

// Exemplo de uso em um componente React
const MeuBotao = () => {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded">
      {/* O ícone recebe nativamente propriedades da tag SVG, facilitando a aplicação de classes do Tailwind */}
      <Loader className="w-4 h-4 animate-spin text-white" /> 
      Carregando...
    </button>
  );
};
```

Todos os ícones implementados recebem na declaração da função `props: React.SVGProps<SVGSVGElement>` (`{...props}`) do lado de dentro do `<svg>`, ou seja:
Você pode passar nativamente configurações de estilizamento fácil como:
* Cores através do tailwind com text-color (`text-blue-500`, `text-green-400`);
* Tamanhos utilizando tailwind (`w-5 h-5`, `w-8 h-8`);
* Classes como `animate-spin` e outras formatações úteis.

---

## Lista de Ícones e Cenários de Uso

Abaixo estão listados todos os ícones disponíveis no repositório, junto a sugestões práticas do ambiente clínico e cenários de uso.

| Ícone | Importação sugerida | Cenário de Uso (Sugestões práticas de UI) |
| --- | --- | --- |
| **Access** | `import Access from '@/components/icons/Access.Icon';` | Botões ou links relacionados à autenticação, login, permissões de usuário ou chaves de acesso. |
| **Add** | `import Add from '@/components/icons/Add.Icon';` | Botões arredondados flutuantes ou em tela de criar um novo item. |
| **AddSquare** | `import AddSquare from '@/components/icons/AddSquare.Icon';` | Adicionar itens dentro de caixas delimitadas, enfatizar a criação em "Cards". |
| **Back** | `import Back from '@/components/icons/Back.Icon';` | Retornar para a tela anterior pelo cabeçalho (seta apontando à esquerda). |
| **Board** | `import Board from '@/components/icons/Board.Icon';` | Menus de representação do Dashboard, quadros de tarefas ou painéis de gerência. |
| **Cake** | `import Cake from '@/components/icons/Cake.Icon';` | Indicadores de paciente aniversariante no dashboard ou detalhe do prontuário. |
| **Calender** | `import Calender from '@/components/icons/Calender.Icon';` | Acesso primário da tela de Agenda e listagem de marcação de horários. *(Original.* `.Icon`)* |
| **CalenderEdit** | `import CalenderEdit from '@/components/icons/CalenderEdit.Icon';` | Edições, remarcações e atualizações em agendamentos existentes. |
| **Card** | `import Card from '@/components/icons/Card.Icon';` | Cadastros de pagamentos, cobranças por cartão na maquininha listadas em financeiro. |
| **ChartPie** | `import ChartPie from '@/components/icons/ChartPie.Icon';` | Gráficos, relatórios gerenciais sobre lucros, balanços de despesas. |
| **Chat** | `import Chat from '@/components/icons/Chat.Icon';` | Bate papo de mensagens internamente entre dentistas e secretárias ou paciente. |
| **Check** | `import Check from '@/components/icons/Check.Icon';` | Validar inputs de formulários bem-sucedidos ou assinalar checkmarks de tarefas prontas. |
| **Clinic** | `import Clinic from '@/components/icons/Clinic.Icon';` | Indicar dados da "Minha Clínica" no painel contendo Razão Social e endereço. |
| **ClipboardDocumentList** | `import ClipboardDocumentList from '@/components/icons/ClipboardDocumentList.Icon';` | Histórico extenso do prontuário de paciente (Anamnese, evoluções). |
| **Clock** | `import Clock from '@/components/icons/Clock.Icon';` | Histórico de consultas recentes, horários estipulados de espera em fila. |
| **CloseSquare** | `import CloseSquare from '@/components/icons/CloseSquare.Icon';` | Ações de fechamento (X) para side-modals/drawers grandes delimitados por caixas. |
| **Cloud** | `import Cloud from '@/components/icons/Cloud.Icon';` | Confirmação de "Tudo sincronizado/salvo. |
| **CloudSun** | `import CloudSun from '@/components/icons/CloudSun.Icon';` | Previsão climática ou status híbridos do sistema e tema dinâmico de UI. |
| **Column** | `import Column from '@/components/icons/Column.Icon';` | Customização e exibição das colunas flexíveis de DataGrids/tabelas de listagem. |
| **Command** | `import Command from '@/components/icons/Command.Icon';` | Visualização de atalhos em menus de navegação complexos (Ex: `⌘+K`). |
| **Copy** | `import Copy from '@/components/icons/Copy.Icon';` | Ícone de botão para copiar o link da consulta, número para pix de pacientes, etc. |
| **Cross** | `import Cross from '@/components/icons/Cross.Icon';` | Rejeições diretas de alertas, banimento, cancelamento de tarefas imediatas (X limpo). |
| **CursorClick** | `import CursorClick from '@/components/icons/CursorClick.Icon';` | Tooltips informando botões para a secretária realizar cliques necessários. |
| **Delete** | `import Delete from '@/components/icons/Delete.Icon';` | Lixeiras de ícones perigosos ao apagar (acompanhado por cor vermelha na UI). |
| **Dental** | `import Dental from '@/components/icons/Dental.Icon';` | Odontograma, procedimentos de especialidades em tratamentos de um paciente em si. |
| **Dollar** | `import Dollar from '@/components/icons/Dollar.Icon';` | Valores monetários globais de faturamento financeiro ou caixa direto. |
| **Dot** | `import Dot from '@/components/icons/Dot.Icon';` | Divisor de itens horizontais e indicativo online/offline com cores verde/cinza na UI centralizada. |
| **Down** | `import Down from '@/components/icons/Down.Icon';` | Ícone da ponta direita de Selects, dropdowns ou indicativo para scroll down. |
| **Download** | `import Download from '@/components/icons/Download.Icon';` | Botão de "Baixar e Exportar" relatórios em excel ou imagens em anexos do prontuário. |
| **Edit** | `import Edit from '@/components/icons/Edit.Icon';` | Ícone puro em forma de caneta em listagens para se iniciar o roteamento para modo "edição". |
| **EditSquare** | `import EditSquare from '@/components/icons/EditSquare.Icon';` | O mesmo que (editar), contudo formatado ao centro de um quadrado. |
| **EmptySquare** | `import EmptySquare from '@/components/icons/EmptySquare.Icon';` | Checkboxes vazios nativo sem a necessidade de biblioteca de rádio inputs. |
| **Envelope** | `import Envelope from '@/components/icons/Envelope.Icon';` | Avisos de emails disparados não lidos aos pacientes de avisos de novas consultas. |
| **EnvelopeOpen** | `import EnvelopeOpen from '@/components/icons/EnvelopeOpen.Icon';` | Mensagens já visualizadas pelo destinatário na auditoria de logs. |
| **Exit** | `import Exit from '@/components/icons/Exit.Icon';` | Último item do Sidebar, deslogar para a tela inicial limpando todos cookies. |
| **Eye** | `import Eye from '@/components/icons/Eye.Icon';` | Alternar senha pra visível/invisível num input ou modo "Apenas Leitura" dos prontuários finalizados. |
| **Face** | `import Face from '@/components/icons/Face.Icon';` | Captura fotográfica do rosto ao efetuar o cadastro de novo paciente pela webcam. |
| **Gear** | `import Gear from '@/components/icons/Gear.Icon';` | Ajustes e Configurações a nível geral (Sistema). |
| **GoogleCalendar** | `import GoogleCalendar from '@/components/icons/GoogleCalendar.Icon';` | Integrar a base de horários da clínica local a sincronização direta de conta google para uso do médico. |
| **Grid** | `import Grid from '@/components/icons/Grid.Icon';` | Visão que transforma as tabelas horizontais nos populares Cards emparelhados. |
| **Help** | `import Help from '@/components/icons/Help.Icon';` | Ícone de dúvida em formato de círculo (`?`) que acompanha textos explicativos nas telas. |
| **Home** | `import { HomeIcon } from '@/components/icons/Home.Icon';` | Retornar para a página inicial (Dashboard), comumente usado como primeiro item em Breadcrumbs de navegação. |
| **ID** | `import ID from '@/components/icons/ID.Icon';` | RG, CPF e número indexado de reconhecimento em formulários do governo e saúde. |
| **IDCard** | `import IDCard from '@/components/icons/IDCard.Icon';` | Apresentação em Crachá dos profissionais / Dentistas para o portal do usuário. |
| **Left** | `import Left from '@/components/icons/Left.Icon';` | Voltar paginação do registro para páginas da Esquerda numa tabela cheia de acessos. |
| **Link** | `import Link from '@/components/icons/Link.Icon';` | Associar arquivos relacionados e gerar URLs públicas do boleto copiáveis aos pacientes. |
| **Loader** | `import Loader from '@/components/icons/Loader.Icon';` | Spinner centralizado ao fazer postagens, preenchimentos via API e Loading UI States. |
| **Lock** | `import Lock from '@/components/icons/Lock.Icon';` | Input somente leitura, dados retidos apenas com autorização para destrancar. |
| **Mail** | `import Mail from '@/components/icons/Mail.Icon';` | Visão global de e-mails em menu de correspondências. |
| **Map** | `import Map from '@/components/icons/Map.Icon';` | Exibir via integração de Mapas da Google ou tração da rota de residência para CEP pesquisado. |
| **Maximize2Sidebar** | `import Maximize2Sidebar from '@/components/icons/Maximize2Sidebar.Icon';` | Variantes expansivas para colapsamento complexo. |
| **MaximizeSidebar** | `import MaximizeSidebar from '@/components/icons/MaximizeSidebar.Icon';` | Expandir sidebar totalmente para exbição de textos descritivos das rotas. |
| **MinimizeSidebar** | `import MinimizeSidebar from '@/components/icons/MinimizeSidebar.Icon';` | Encolher tudo na navegação sobrando visiveis só os icones e ganhando espaço prático na tela do dentista. |
| **Minus** | `import Minus from '@/components/icons/Minus.Icon';` | Remover contagem negativa (Subtrair parcelas). |
| **Mixer** | `import Mixer from '@/components/icons/Mixer.Icon';` | Símbolo generalista de engate de filtros em modais abertos do canto da tela (Filtrar tabelas). |
| **Moon** | `import Moon from '@/components/icons/Moon.Icon';` | Configurar interface padrão no aplicativo em cores escuras de descanso. |
| **MoonTheme** | `import MoonTheme from '@/components/icons/MoonTheme.Icon';` | O switcher visível de tema pelo Header (Transformar p/ dark theme). |
| **NoPaid** | `import NoPaid from '@/components/icons/NoPaid.Icon';` | Pacientes em inadimplência e identificador forte p/ repassar alerta financeiro grave. |
| **Notification** | `import Notification from '@/components/icons/Notification.Icon';` | Sino em vermelho que acumula quantidade de alertas pendentes no topo de seu app. |
| **Package** | `import Package from '@/components/icons/Package.Icon';` | Inventários odontológicos, controle de medicamentos e contagem de itens de estoque no armário. |
| **Paid** | `import Paid from '@/components/icons/Paid.Icon';` | Orçamentos compensados, boletos pagos e status esverdeado no financeiro marcando Sucesso ($). |
| **Patients** | `import Patients from '@/components/icons/Patients.Icon';` | Menu central de gerenciamento e visão massiva dos acompanhamentos, aba "Pacientes". |
| **Phone** | `import Phone from '@/components/icons/Phone.Icon';` | Representando dados e botões interativos para Ligar ou ver número de contatos de pacientes. |
| **Point** | `import Point from '@/components/icons/Point.Icon';` | Ponto estático pra legendas e uso de mapeamento em superfícies do Tratamento em Odontograma. |
| **Printer** | `import Printer from '@/components/icons/Printer.Icon';` | Botão prático do paciente para emitir PDF do atestado direto do receituário. |
| **Pulse** | `import Pulse from '@/components/icons/Pulse.Icon';` | Sinais de vida, verificação médica e prontidão orgânica nos dados e métricas puras. |
| **Reload** | `import Reload from '@/components/icons/Reload.Icon';` | Recarrega listas em caching para garantir a validação original (Refresh manual sem o f5). |
| **Right** | `import Right from '@/components/icons/Right.Icon';` | Avançar listagens horizontalmente ao usar paginadores extensos pro ldb. |
| **Search** | `import Search from '@/components/icons/Search.Icon';` | Input Lupa de busca da Navbar. Typeahead pra descobrir novos pacientes rápidos num clique. |
| **SelectedSquare** | `import SelectedSquare from '@/components/icons/SelectedSquare.Icon';` | Estado de checkbox ligado numa grade de seleções múltiplas. |
| **Send** | `import Send from '@/components/icons/Send.Icon';` | Foguete ou envio tipo chat para submissão forte sem usar as palavras "enviar". |
| **Service** | `import Service from '@/components/icons/Service.Icon';` | Entidades que a sua clínica vende avulsa na gestão do seu próprio portfolio, botões operacionais. |
| **Sort** | `import Sort from '@/components/icons/Sort.Icon';` | Botão em cabeçalho das tabelas para ascender/descender (Menor ou maior data de criação por exemplo). |
| **Star** | `import Star from '@/components/icons/Star.Icon';` | Avaliações no fim da consulta em 5 estrelas ou favoritar um acesso contínuo. |
| **Sun** | `import Sun from '@/components/icons/Sun.Icon';` | Temas genéricos ou representação diurna explícita no ambiente. |
| **SunDim** | `import SunDim from '@/components/icons/SunDim.Icon';` | Condição diurna alternativa com raios e formatações atenuadas (Uso para status adaptáveis de tema). |
| **SunTheme** | `import SunTheme from '@/components/icons/SunTheme.Icon';` | Comutador explícito que troca o painel inteiro para as cores brancas tradicionais via o Header. |
| **TrendingDown** | `import TrendingDown from '@/components/icons/TrendingDown.Icon';` | Estatísticas preocupantes em sumários executivos demonstrando diminuição clara de KPIs monetários. |
| **TrendingUp** | `import TrendingUp from '@/components/icons/TrendingUp.Icon';` | Retornos de alta performance, lucro contínuo, aumento de KPIs exibidos no Resumo Mensal com setas vermelhas. |
| **Up** | `import Up from '@/components/icons/Up.Icon';` | Recuar as sanfonas e inputs agrupados do painel após expandir. |
| **Upload** | `import Upload from '@/components/icons/Upload.Icon';` | Área restrita p/ selecionar nova foto e atualizar no Perfil nativo no servidor. |
| **UploadCloud** | `import UploadCloud from '@/components/icons/UploadCloud.Icon';` | Grandes blocos de submissão estilo Dropzone que permitem vários arquivos ao mesmo tempo. |
| **User** | `import User from '@/components/icons/User.Icon';` | Identidade direta visual no sistema para os avatares limpos (fallback p/ foto inexperiente do usuario). |
| **Wallet** | `import Wallet from '@/components/icons/Wallet.Icon';` | Contorno global sobre painel financeiro, movimentações e histórico monetário nas carteiras. |
| **Whatsapp** | `import Whatsapp from '@/components/icons/Whatsapp.Icon';` | Botão Verde do zap associado ao disparo do app para envio do orçamento por mensagem. |
