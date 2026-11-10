import { assetPath } from "@/lib/campaign";
export const metadata = { title: "Privacidade | WOA Talk" };
export default function Privacy() {
  return (
    <main className="privacy-page">
      <a href={assetPath("/")}>← Voltar à campanha</a>
      <h1>Privacidade e proteção de dados</h1>
      <p>
        <strong>Versão para revisão — 10/11/2026.</strong> A identificação
        jurídica do controlador e o e-mail de privacidade precisam ser
        preenchidos antes da publicação.
      </p>
      <h2>Dados e finalidades</h2>
      <p>
        O formulário solicita nome, e-mail, WhatsApp e autorização de contato
        para responder ao interesse nas turmas e enviar informações desta
        campanha. O cadastro não confirma matrícula. A autorização de contato é
        separada do consentimento para marketing da Meta.
      </p>
      <h2>Marketing e cookies</h2>
      <p>
        O Pixel da Meta, ID 2168410580211263, só é carregado após aceitar
        marketing. Envia o evento de visita PageView e pode tratar
        identificadores do navegador, endereço IP e informações técnicas. Não
        configuramos envio dos campos do formulário ao Pixel nem correspondência
        avançada. Recusar não impede acesso às aulas, PDFs ou ao formulário. A
        preferência é guardada localmente no navegador e pode ser alterada em
        “Preferências de privacidade”. A revogação interrompe carregamentos
        futuros; não desfaz tratamentos anteriores.
      </p>
      <h2>Serviços envolvidos</h2>
      <p>
        O cadastro é encaminhado ao Supabase. A hospedagem poderá utilizar
        Vercel. Vídeos são carregados do YouTube após interação. Pagamentos e
        contatos abrem Asaas e WhatsApp, sujeitos às políticas desses
        fornecedores. Esses serviços podem realizar tratamento ou transferência
        internacional de dados conforme suas condições.
      </p>
      <h2>Seus direitos</h2>
      <p>
        Nos termos da LGPD, você pode solicitar confirmação de tratamento,
        acesso, correção, informações sobre compartilhamento, revogação de
        consentimento e exclusão quando aplicável. Até a definição do canal
        específico de privacidade, fale com Oliver pelo WhatsApp +55 (61)
        8117-6884 para encaminhar sua solicitação.
      </p>
      <h2>Retenção e segurança</h2>
      <p>
        O prazo de retenção e o procedimento de exclusão precisam ser definidos
        pelo responsável antes da publicação. O acesso deve ser limitado às
        pessoas autorizadas; nenhuma medida elimina todos os riscos.
      </p>
      <h2>Responsável</h2>
      <p>
        WOA Talk — razão social/nome do controlador, CNPJ quando aplicável e
        e-mail de privacidade pendentes de confirmação.
      </p>
    </main>
  );
}
