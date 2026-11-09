
import CampaignFooter from "../_components/CampaignFooter";
import { PRIVACY_NOTICE_VERSION } from "../_content/privacy.mjs";
import styles from "./privacy.module.css";

export const metadata = {
  title: "Política de Privacidade da campanha | WOA Talk",
  description:
    "Como os dados do cadastro da campanha Black November WOA Talk são utilizados e como exercer seus direitos.",
};

export default function PrivacyPage() {
  return (
    <>
      <main className={styles.page}>
        <article className={styles.document}>
          <a href="/blacknovember" className={styles.brand}>
            <img
              src="/blacknovember/images/logo-woa-transparent.png"
              alt="WOA Talk"
              width="88"
              height="72"
            />
            <span>BLACK NOVEMBER / WOA TALK</span>
          </a>

          <p className="eyebrow">SEUS DADOS, SUAS ESCOLHAS</p>

          <h1>Política de Privacidade</h1>

          <p className={styles.lead}>
            Esta página trata do cadastro e das comunicações da
            campanha Black November WOA Talk. Não substitui as
            políticas de outros serviços utilizados pelo participante.
          </p>

          <p className={styles.version}>
            Atualização: 9 de novembro de 2026 · Versão{" "}
            {PRIVACY_NOTICE_VERSION}
          </p>

          <section>
            <h2>1. Quem é responsável</h2>

            <p>
              A WOA Educacional, CNPJ 54.717.782/0001-03,
              é responsável pelas decisões sobre os dados
              deste cadastro. Endereço: SQN 409, Bloco J,
              Sala 305, Asa Norte, Brasília–DF,
              CEP 70857-100.
            </p>

            <p>
              Contato para privacidade, acesso, correção ou
              exclusão:{" "}
              <a href="mailto:contato@woaeducacional.com.br">
                contato@woaeducacional.com.br
              </a>.
            </p>
          </section>

          <section>
            <h2>2. Quais informações o formulário registra</h2>

            <ul>
              <li>
                Nome, e-mail e telefone com código do país e DDD.
              </li>

              <li>
                Aceite das comunicações desta campanha e sua
                escolha, separada e opcional, sobre outras
                ofertas da WOA.
              </li>

              <li>
                Data do cadastro, identificação da campanha
                e versão do aviso de privacidade.
              </li>

              <li>
                Parâmetros de origem da campanha presentes
                no endereço do link, como utm_source e
                utm_campaign, quando disponíveis.
              </li>
            </ul>

            <p>
              Este formulário não solicita senha, documento
              de identidade ou dados de pagamento.
            </p>
          </section>

          <section>
            <h2>3. Para que os dados são usados</h2>

            <p>
              Os dados permitem identificar seu cadastro,
              entrar em contato sobre a experiência,
              orientar a liberação do Starter e informar
              sobre as quatro aulas especiais. O recebimento
              de outras ofertas depende da opção adicional
              do formulário.
            </p>

            <p>
              As autorizações são registradas no cadastro.
              Você pode retirar seu consentimento pelo
              e-mail de contato, inclusive para deixar de
              receber ofertas. Sem fornecer os dados e
              autorizar as comunicações da campanha, não
              é possível concluir este cadastro. A autorização
              para outras ofertas é facultativa.
            </p>
          </section>

          <section>
            <h2>4. Armazenamento e serviços utilizados</h2>

            <p>
              O formulário envia o cadastro ao servidor
              do site, que utiliza o Supabase para armazenar
              os registros. A equipe da WOA utiliza esses
              dados para administrar a campanha e atender
              os participantes.
            </p>

            <p>
              A região de armazenamento e as condições
              dos serviços de infraestrutura dependem
              da configuração do projeto da WOA.
              Informações sobre localização, eventual
              transferência internacional e entidades
              com as quais seus dados foram compartilhados
              podem ser solicitadas pelo canal de privacidade.
            </p>

            <p>
              Não envie senhas ou informações sensíveis
              nos campos do cadastro nem por e-mail
              para solicitar acesso.
            </p>
          </section>

          <section>
            <h2>5. Grupo do WhatsApp</h2>

            <p>
              Após concluir o cadastro, você recebe um
              botão para abrir o convite do grupo oficial.
              O cadastro não adiciona seu telefone
              automaticamente ao grupo.
            </p>

            <p>
              Ao decidir entrar, você passa a utilizar
              o WhatsApp, sujeito às regras e políticas
              desse serviço. Outros participantes e
              administradores podem visualizar informações
              do seu perfil e telefone, conforme o
              funcionamento do grupo e suas configurações.
              Evite compartilhar dados pessoais de terceiros
              nas mensagens.
            </p>
          </section>

          <section>
            <h2>6. Por quanto tempo os dados ficam guardados</h2>

            <p>
              <strong>
                A WOA ainda não definiu um prazo fixo
                de retenção após esta campanha.
              </strong>{" "}
              Esta política não informa uma data de
              exclusão automática. Você pode solicitar
              informações sobre a conservação do seu
              cadastro ou pedir sua exclusão pelo
              e-mail indicado.
            </p>

            <p>
              A conservação deve estar vinculada às
              finalidades informadas e às hipóteses
              permitidas pela legislação. Se um pedido
              não puder ser atendido de imediato,
              a WOA deverá explicar os motivos e
              eventual necessidade de conservação.
            </p>
          </section>

          <section>
            <h2>7. Seus direitos e como pedir atendimento</h2>

            <p>
              Você pode solicitar confirmação do tratamento,
              acesso e correção; informações sobre
              compartilhamentos; anonimização, bloqueio
              ou exclusão de dados desnecessários ou
              irregulares; portabilidade nos termos da
              regulamentação; exclusão de dados tratados
              com consentimento, ressalvadas as exceções
              legais; e revogação do consentimento.
            </p>

            <p>
              Também pode obter informações sobre a
              possibilidade e as consequências de não
              consentir e apresentar uma petição à
              Autoridade Nacional de Proteção de Dados.
            </p>

            <p>
              Envie sua solicitação para{" "}
              <a href="mailto:contato@woaeducacional.com.br">
                contato@woaeducacional.com.br
              </a>
              , indicando o e-mail usado no cadastro
              e o que deseja. O atendimento é gratuito.
              A WOA poderá pedir somente informações
              necessárias para confirmar sua identidade
              e proteger seus dados.
            </p>
          </section>

          <section>
            <h2>8. Alterações deste aviso</h2>

            <p>
              A versão e a data desta página identificam
              as informações apresentadas. Mudanças de
              finalidade que dependam de nova autorização
              não ficam autorizadas apenas pela
              atualização desta página.
            </p>

            <p>
              Referência:{" "}
              <a
                href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lei Geral de Proteção de Dados Pessoais (LGPD)
              </a>.
            </p>
          </section>

          <section>
            <h2>
              9. Cookies de publicidade, Meta Pixel e API de Conversões
            </h2>

            <p>
              Com sua autorização para publicidade, a WOA
              poderá utilizar o Meta Pixel para medir visitas
              às páginas da campanha e cadastros concluídos.
              O Pixel é carregado no navegador somente após
              a escolha "Aceitar publicidade".
            </p>

            <p>
              Quando habilitada, a API de Conversões da Meta
              (CAPI) poderá transmitir diretamente do servidor
              o evento Lead, após a confirmação do cadastro
              pelo Supabase e desde que exista consentimento
              de publicidade.
            </p>

            <p>
              O Meta Pixel e a API de Conversões utilizam
              o mesmo identificador técnico de evento
              para reduzir a possibilidade de contabilização
              duplicada de um mesmo cadastro.
            </p>

            <p>
              A Meta poderá receber informações técnicas
              de navegação, como o endereço público da
              campanha, endereço IP, identificação do
              navegador, identificadores de cookies
              utilizados pelo Pixel e um identificador
              aleatório do evento.
            </p>

            <p>
              Esta integração não transmite nome, e-mail,
              telefone ou outros campos do formulário à Meta.
              Também não ativa correspondência avançada
              e não utiliza os dados pessoais do formulário
              para identificar diretamente o participante
              perante a Meta.
            </p>

            <p>
              A escolha de publicidade é independente das
              autorizações de comunicação da campanha.
              Recusar publicidade não impede o cadastro.
              A opção "Cookies de publicidade" permite
              revisar ou revogar sua escolha.
            </p>

            <p>
              A preferência é armazenada neste navegador.
              Ao revogar o consentimento, a integração
              deixa de autorizar novos eventos publicitários,
              mas não consegue desfazer eventos
              anteriormente enviados.
            </p>

            <p>
              Para reduzir a exposição de parâmetros
              de navegação, a aplicação preserva
              separadamente os cinco parâmetros UTM
              de atribuição e prepara um endereço
              limpo antes de carregar o Meta Pixel.
            </p>

            <p>
              As UTMs continuam disponíveis para
              registrar a origem do cadastro no Supabase,
              inclusive quando a publicidade é recusada.
              Esses parâmetros não são enviados à Meta
              por esta integração.
            </p>

            <p>
              O parâmetro fbclid não é preservado
              pela lógica atual de atribuição da campanha.
              O endereço de origem também é protegido
              por uma política de não compartilhamento
              do referenciador (no-referrer).
            </p>

            <p>
              Se não for possível preparar um documento
              adequado para o rastreamento, o Meta Pixel
              permanece bloqueado. A participação na
              campanha continua disponível independentemente
              da autorização para publicidade.
            </p>
          </section>

          <a className="button" href="/blacknovember">
            Voltar à campanha →
          </a>
        </article>
      </main>

      <CampaignFooter />
    </>
  );
}
