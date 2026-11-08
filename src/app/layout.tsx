// Scaffold do projeto independente. Não copiar para o aplicativo oficial.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body style={{ margin: 0 }}>{children}</body></html>;
}
