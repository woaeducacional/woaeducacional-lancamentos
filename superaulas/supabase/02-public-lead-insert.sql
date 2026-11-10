-- Aplicar somente depois de revisar 01-inspect-leads.sql.
-- Não remove políticas/grants existentes nem desativa RLS.
-- Operação limitada a permitir INSERT público dos quatro campos de cadastro.
begin;
do $$
begin
  if to_regclass('public.black_november_leads') is null then
    raise exception 'Tabela ausente: conferir o projeto e o schema antes de continuar.';
  end if;
  if not (select relrowsecurity from pg_class where oid = 'public.black_november_leads'::regclass) then
    raise exception 'RLS não está ativo. Revisar os consumidores e políticas existentes antes de habilitá-lo; nada foi alterado.';
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'black_november_leads'
      and is_nullable = 'NO' and column_default is null and is_identity = 'NO'
      and is_generated = 'NEVER' and column_name not in ('name','email','phone','campaign_consent')
  ) then
    raise exception 'Há outros campos obrigatórios sem default. Adaptar o payload após revisar o schema; nada foi alterado.';
  end if;
end $$;

grant insert (name, email, phone, campaign_consent) on public.black_november_leads to anon;

create policy woa_superaulas_public_lead_insert
on public.black_november_leads
for insert to anon
with check (
  campaign_consent is true
  and char_length(trim(name)) between 2 and 120
  and char_length(email) between 3 and 254
  and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  and phone ~ '^[1-9][0-9]{9,14}$'
);
commit;
-- Esta política não concede SELECT, UPDATE ou DELETE.
-- As demais políticas são preservadas e precisam ser auditadas separadamente.
-- Não reaplicar se a política já existir; conferir a definição em 01-inspect-leads.sql.
