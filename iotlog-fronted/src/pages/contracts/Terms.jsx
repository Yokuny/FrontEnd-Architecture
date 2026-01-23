import React from "react";
import { useTheme } from "styled-components";

export default function Terms() {
  const theme = useTheme();
  return (
    <>
      <div className="pl-4 pr-4" style={{ background: theme.backgroundBasicColor1 }}>
        <h2>Termos &amp; Condições</h2>
        <p>
          Ao criar sua conta ou acessar a aplicação IoTLog, esses termos serão
          aplicados automaticamente a você. Por isso, certifique-se de lê-los
          com atenção antes de usar. Você não tem permissão para copiar ou
          modificar a aplicação, qualquer parte da aplicação ou nossas marcas
          registradas de forma alguma. Você não tem permissão para tentar
          extrair o código-fonte da aplicação e também não deve tentar traduzir
          a aplicação para outros idiomas ou criar versões derivadas. O própria
          aplicação e todas as marcas registradas, direitos autorais e outros
          direitos de propriedade intelectual relacionados a ele pertencem à
          BYKONZ TECNOLOGIA LTDA inscrita sob CNPJ 45.175.828/0001-19.
        </p>
        <p>
          A BYKONZ TECNOLOGIA LTDA está empenhada em garantir que a aplicação
          seja o mais útil e eficiente possível. Por esse motivo, reservamo-nos
          o direito de fazer alterações na aplicação ou cobrar por seus
          serviços, a qualquer momento e por qualquer motivo. Nunca cobraremos
          pela aplicação nem pelos serviços sem deixar claro para você
          exatamente o que você está pagando.
        </p>
        <p>
          A BYKONZ TECNOLOGIA LTDA não se responsabiliza por qualquer dados
          informados ou cadastro no IoTLog. Você concorda que é o responsável
          pelas informações e dados pessoais que cadastrar e em hipotese alguma
          irá cadastrar ou insirir a informação pessoal de uma pessoa sem o
          concentimento total da mesma, sob pena da Lei Geral de Proteção de
          Dados Pessoais (LGPD). E ainda você concorda em compartilhar os dados
          pessoais com BYKONZ TECNOLOGIA LTDA, já que a mesma fornece os
          serviços de manutenção e quaisquer outros serviços para manter a
          aplicação funcionando.
        </p>
        <p>
          Você deve estar ciente de que há certas coisas que a KONZTEC
          TECNOLOGIA LTDA não se responsabilizará. Certas funções da aplicação
          exigirão que você tenha uma conexão ativa com a Internet. A conexão
          pode ser Wi-Fi, ou fornecida pelo seu provedor de rede móvel, mas a
          BYKONZ TECNOLOGIA LTDA não pode assumir a responsabilidade pela
          aplicatição não funcionar com funcionalidade completa se você não
          tiver acesso ao Wi-Fi e não tiver do seu subsídio de dados à esquerda.
        </p>
        <p></p>
        <p>
          Se você estiver usando a aplicação fora de uma área com Wi-Fi,
          lembre-se de que seus termos do contrato com seu provedor de rede
          móvel ainda serão aplicáveis. Como resultado, você pode ser cobrado
          pela operadora de celular pelo custo dos dados pela duração da conexão
          enquanto acessa a aplicação ou por outras cobranças de terceiros. Ao
          usar o aplicativo, você está sendo responsabilizado por essas
          cobranças, incluindo cobranças por dados em roaming, se você usar a
          aplicação fora do território de origem (ou seja, região ou país) sem
          desativar o roaming de dados. Se você não é o pagador de contas do
          dispositivo no qual está usando a aplicação, saiba que supomos que
          você recebeu permissão do pagador de contas para usar a aplicação.
        </p>
        <p>
          A BYKONZ TECNOLOGIA LTDA se reserva a poder encerrar a sua conta,
          caso identifique abuso, conteúdo impróprio, ofensivo ou violação na
          integridade da aplicação . Cabe a BYKONZ TECNOLOGIA LTDA definir os
          critérios para abuso, conteúdo impróprio, ofensivo e violação na
          integridade.
        </p>
        <p>
          Cabe ao responsável pela aplicação, tomador do serviço ou ainda quem
          contratou o produto/serviços IoTLog realizar os pagamentos financeiros
          de acordo com o combinado. Caso o pagamento não esteja em dia, a
          BYKONZ TECNOLOGIA LTDA poderá encerrar o produto/serviço contratado.
        </p>

        <p>
          <strong>Alterações para estes Termos e Condições</strong>
        </p>
        <p>
          Podemos atualizar nossos Termos e Condições de tempos em tempos.
          Assim, você é aconselhado para rever esta página periodicamente para
          quaisquer alterações. Vamos notificá-lo de qualquer alterações,
          publicando os novos Termos e Condições nesta página. Essas alterações
          são efetivas imediatamente depois que eles são publicados nesta
          página.
        </p>
        <p>
          <strong>Contate nos</strong>
        </p>
        <p>
          Se você tiver dúvidas ou sugestões sobre nossos Termos e Condições,
          não hesite em entrar em contato conosco.
        </p>
      </div>
    </>
  );
}
