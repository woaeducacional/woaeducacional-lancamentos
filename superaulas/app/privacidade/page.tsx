import { assetPath } from "@/lib/campaign";

export const metadata = { title: "Privacidade | WOA Talk" };

export default function Privacy() {
  return (
    <main className="privacy-page">
      <a href={assetPath("/")}>← Voltar às Super Aulas</a>
      <h1>Privacidade e proteção de dados</h1>
      <p>
        Esta página trata do cadastro e das comunicações das Super Aulas
        WOA Exclusive — Black November WOA Talk. Não substitui as políticas
        dos serviços externos utilizados pelo participante.
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
        consentimento e exclusão quando aplicável. Para solicitar atendimento,
        escreva para{" "}
        <a href="mailto:contato@woaeducacional.com.br">
          contato@woaeducacional.com.br
        </a>, indicando o e-mail utilizado no cadastro e o que deseja.
      </p>
      <h2>Retenção e segurança</h2>
      <p>
        A WOA ainda não definiu um prazo fixo de retenção após esta campanha.
        Esta política não informa uma data de exclusão automática. Você pode
        solicitar informações sobre a conservação de seu cadastro ou pedir
        exclusão pelo e-mail indicado. A conservação deve estar vinculada às
        finalidades informadas e às hipóteses permitidas pela legislação.
        O acesso aos registros deve ser limitado às pessoas autorizadas;
        nenhuma medida elimina todos os riscos.
      </p>
      <h2>Responsável</h2>
      <p>
        A WOA Educacional, CNPJ 54.717.782/0001-03, é responsável pelas
        decisões sobre os dados deste cadastro. Endereço: SQN 409, Bloco J,
        Sala 305, Asa Norte, Brasília–DF, CEP 70857-100. Contato para
        privacidade, acesso, correção ou exclusão:{" "}
        <a href="mailto:contato@woaeducacional.com.br">
          contato@woaeducacional.com.br
        </a>.
      </p>
    </main>
  );
}
