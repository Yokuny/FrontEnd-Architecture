import React from "react";
import { useTheme } from "styled-components";

export default function Policy() {
  const theme = useTheme();
  return (
    <>
      <div className="pl-4 pr-4" style={{ background: theme.backgroundBasicColor1 }}>
        <h2>Política de privacidade</h2>
        <p>
          {" "}
          BYKONZ TECNOLOGIA LTDA é a responsável pelo produto IoTLog como um
          produto comercial. O produto é fornecido por BYKONZ TECNOLOGIA LTDA e
          de uso exclusivo de quem contratou o serviço.
        </p>
        <p>
          Esta página é usada para informar os visitantes sobre nossas políticas
          com a coleta, uso e divulgação de Informações Pessoais, se alguém
          decidir usar o nosso Serviço.
        </p>
        <p>
          Se você optar por usar nosso Serviço, você concorda com a coleta e uso
          de informações em relação a esta política. As Informações Pessoais que
          coletamos são usadas para fornecer e melhorar o serviço. Não usaremos
          ou compartilharemos suas informações com ninguém, exceto conforme
          descrito nesta Política de Privacidade.
        </p>
        <p>
          <strong>Coleta e Uso de Informações</strong>
        </p>
        <p>
          Para uma melhor experiência, ao usar nosso Serviço, podemos exigir que
          você nos forneça informação pessoalmente identificável. As informações
          que solicitamos serão retidas por nós e poderão ser compartilhadas com
          os provedores de serviços de terceiros apresentados abaixo (caso
          necessário) e usadas conforme descrito nesta política de privacidade.
        </p>
        <p></p>
        <div>
          <p>
            Link para a política de privacidade de provedores de serviços de
            terceiros usados ​​pelo aplicativo
          </p>
          <ul>
            <li>
              <a href="https://www.whatsapp.com/privacy" target="_blank">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <p>
          <strong>Log de dados</strong>
        </p>
        <p>
          Queremos informá-lo que sempre que você usar o nosso Serviço, em um
          caso de um erro no aplicativo coletamos dados e informações (por meio
          de produtos de terceiros) em seu telefone chamado "Log Data". Esses
          dados de registro podem incluir informações como o endereço IP do
          dispositivo, geolocalização, nome do dispositivo, versão do sistema
          operacional, a configuração do aplicativo ao utilizar nosso Serviço, a
          hora e a data do seu uso do Serviço e outras estatísticas.
        </p>
        <p>
          <strong>Provedores de serviço</strong>
        </p>
        <p>
          Podemos empregar empresas e indivíduos de terceiros devido às
          seguintes razões:
        </p>
        <ul>
          <li>Para facilitar nosso serviço;</li>
          <li>Para fornecer o serviço em nosso nome;</li>
          <li>Para executar serviços relacionados a serviços; ou</li>
          <li>Para nos ajudar a analisar como nosso Serviço é usado.</li>
        </ul>
        <p>
          Queremos informar aos usuários deste Serviço que esses terceiros têm
          acesso a suas informações pessoais. O motivo é executar as tarefas
          atribuídas a eles em nosso nome. Contudo, eles são obrigados a não
          divulgar ou usar as informações para qualquer outra finalidade.
        </p>
        <p>
          <strong>Segurança</strong>
        </p>
        <p>
          {" "}
          Valorizamos sua confiança em nos fornecer suas informações pessoais,
          por isso estamos nos esforçando usar meios comercialmente aceitáveis
          ​​de protegê-lo. Mas lembre-se que nenhum método de transmissão a
          internet, ou o método de armazenamento eletrônico é 100% seguro e
          confiável, e não podemos garantir sua segurança absoluta.
        </p>
        <p>
          <strong>Links para outros sites</strong>
        </p>
        <p>
          Este Serviço pode conter links para outros sites. Se você clicar em um
          link de terceiros, você será direcionado para esse site. Observe que
          esses sites externos não são operados por nós. Portanto, nós
          fortemente aconselhá-lo a rever a Política de Privacidade desses
          sites. Nós não temos controle sobre e não assumimos qualquer
          responsabilidade pelo conteúdo, políticas de privacidade ou práticas
          de quaisquer sites de terceiros ou serviços.
        </p>
        <p>
          <strong>Privacidade para crianças</strong>
        </p>
        <p>
          Estes Serviços não abordam ninguém com idade inferior a 13 anos.
          informações pessoalmente identificáveis ​​de crianças menores de 13
          anos. No caso, descobrimos que uma criança abaixo de 13 nos forneceu
          informações pessoais, nós imediatamente excluímos isso de nossos
          servidores. Se você é pai ou responsável e sabe que seu filho nos
          forneceu informações pessoais informações, entre em contato conosco
          para que possamos realizar as ações necessárias.
          <p>
            <strong>Geolocalização</strong>
          </p>
          <p>
            Estes serviços poderam utilizar sua localização para identificar
            locais e eventos próximos à sua localização.
          </p>
        </p>
        <p>
          <strong>Alterações em nosso política de privacidade</strong>
        </p>
        <p>
          {" "}
          Podemos atualizar nossa Política de Privacidade de tempos em tempos.
          Assim, você é aconselhado a revisar esta página periodicamente para
          quaisquer alterações. Vamos notificá-lo de quaisquer alterações por
          postar a nova Política de Privacidade nesta página. Estas alterações
          entram em vigor imediatamente após serem publicadas em esta página.
        </p>
        <p>
          <strong>Contate nos</strong>
        </p>
        <p>
          Se você tiver dúvidas ou sugestões sobre nossa Política de
          privacidade, não hesite em entrar em contato conosco.
        </p>
      </div>
    </>
  );
}
