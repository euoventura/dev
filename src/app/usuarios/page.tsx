'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

type Usuario = {
  uuid: string
  nome: string
  dataNascimento: string
  idade: number
  email: string
  cpf: string
  dataCadastro: string
  dataAtualizacao: string
  dataExclusao?: string | null
}
  console.log('%cDesenvolvido por Ventura Dev 🚀', 'color: #6366f1; font-size: 16px;')

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null)

  useEffect(() => {
    axios.get('/api/usuario')
      .then(res => setUsuarios(res.data))
      .catch(() => alert('Erro ao carregar usuários'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSoftDelete(uuid: string) {
    if (!confirm('Tem certeza que quer excluir esse usuário?')) return
    setDeletingUuid(uuid)
    try {
      await axios.delete(`/api/usuario/${uuid}`)
      setUsuarios(prev =>
        prev.map(u => u.uuid === uuid ? { ...u, dataExclusao: new Date().toISOString() } : u)
      )
      alert('Usuário excluído com sucesso.')
    } catch {
      alert('Erro ao excluir usuário.')
    } finally {
      setDeletingUuid(null)
    }
  }

  const usuariosAtivos = usuarios.filter(u => !u.dataExclusao)

  if (loading) return <p className="p-8 text-center">Carregando usuários...</p>
  if (usuariosAtivos.length === 0) return <p className="p-8 text-center">Nenhum usuário encontrado.</p>

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white text-black rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Lista de Usuários</h1>

      <div className="flex justify-end mb-4">
        <Link href="/usuarios/novo" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
          Cadastrar Novo Usuário
        </Link>
      </div>

      <div className="overflow-auto rounded border border-gray-300 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">UUID</th>
              <th className="border px-4 py-2 text-left">Nome</th>
              <th className="border px-4 py-2 text-left">Data Nasc.</th>
              <th className="border px-4 py-2 text-left">Idade</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">CPF</th>
              <th className="border px-4 py-2 text-left">Data Cadastro</th>
              <th className="border px-4 py-2 text-center">Editar</th>
              <th className="border px-4 py-2 text-center">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {usuariosAtivos.map(u => (
              <tr key={u.uuid} className="hover:bg-gray-50">
                <td className="border px-4 py-2 break-words max-w-xs">
                  <Link
                    href={`/usuarios/${u.uuid}`}
                    className="text-blue-600 hover:underline"
                  >
                    {u.uuid}
                  </Link>
                </td>
                <td className="border px-4 py-2">{u.nome}</td>
                <td className="border px-4 py-2">{u.dataNascimento}</td>
                <td className="border px-4 py-2">{u.idade}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{formatCPF(u.cpf)}</td>
                <td className="border px-4 py-2">{formatDate(u.dataCadastro)}</td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    href={`/usuarios/${u.uuid}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-3 py-1 rounded"
                  >
                    Editar
                  </Link>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    disabled={deletingUuid === u.uuid}
                    onClick={() => handleSoftDelete(u.uuid)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded disabled:opacity-50"
                  >
                    {deletingUuid === u.uuid ? 'Excluindo...' : 'Excluir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
