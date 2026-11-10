-- Somente metadados: não lê registros nem dados pessoais.
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'black_november_leads'
order by ordinal_position;

select relrowsecurity as rls_enabled, relforcerowsecurity as force_rls
from pg_class where oid = to_regclass('public.black_november_leads');

select policyname, permissive, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public' and tablename = 'black_november_leads';

select grantee, privilege_type from information_schema.table_privileges
where table_schema = 'public' and table_name = 'black_november_leads'
and grantee in ('anon', 'authenticated', 'PUBLIC');
