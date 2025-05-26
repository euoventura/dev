export default function Home() {
  
console.log('%cDesenvolvido por @euoventura', 'color: #6366f1; font-size: 16px;')

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-white text-black">
      <h1 className="text-4xl font-bold mb-6">Controle de Usuários</h1>
      <p className="mb-4 text-lg">
        Acesse a lista de usuários para gerenciar cadastros.
      </p>

      <div className="flex gap-4">
        <a
          href="/usuarios"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded"
        >
          Ir para Usuários
        </a>

        <a
          href="/usuarios/novo"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded"
        >
          Cadastrar Usuário
        </a>
      </div>
    </main>
  )
}
