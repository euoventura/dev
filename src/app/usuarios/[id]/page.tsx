'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'

type Usuario = {
  uuid: string
  nome: string
  dataNascimento: string
  idade: number
  email: string
  cpf: string
  hashUsuario: string
  dataCadastro: string
  dataAtualizacao: string
  dataExclusao?: string | null
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export default function UsuarioDetalhes() {
  const { id } = useParams()
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get(`/usuario/${id}`)
      .then(res => setUsuario(res.data))
      .catch(() => {
        alert('Erro ao carregar usuário')
        router.push('/usuarios')
      })
      .finally(() => setLoading(false))
  }, [id, router])

  async function handleSoftDelete() {
    if (!usuario) return
    if (!confirm('Tem certeza que quer excluir esse usuário?')) return
    setDeleting(true)
    try {
      await api.delete(`/usuario/${usuario.uuid}`)
      alert('Usuário excluído (soft delete) com sucesso.')
      router.push('/usuarios')
    } catch {
      alert('Erro ao excluir usuário.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <p className="p-8 text-center">Carregando usuário...</p>
  if (!usuario) return <p className="p-8 text-center">Usuário não encontrado.</p>

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">Detalhes do Usuário</h1>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-left">
        <dt className="font-semibold">UUID</dt>
        <dd className="break-words max-w-xs font-mono">{usuario.uuid}</dd>

        <dt className="font-semibold">Nome</dt>
        <dd>{usuario.nome}</dd>

        <dt className="font-semibold">Data de Nascimento</dt>
        <dd>{usuario.dataNascimento}</dd>

        <dt className="font-semibold">Idade</dt>
        <dd>{usuario.idade}</dd>

        <dt className="font-semibold">Email</dt>
        <dd>{usuario.email}</dd>

        <dt className="font-semibold">CPF</dt>
        <dd className="text-red-600">{formatCPF(usuario.cpf)}</dd>

        <dt className="font-semibold">Hash Usuário</dt>
        <dd className="break-words max-w-xs font-mono text-xs">{usuario.hashUsuario}</dd>

        <dt className="font-semibold">Data Cadastro</dt>
        <dd>{formatDate(usuario.dataCadastro)}</dd>

        <dt className="font-semibold">Data Atualização</dt>
        <dd>{formatDate(usuario.dataAtualizacao)}</dd>

        <dt className="font-semibold">Data Exclusão</dt>
        <dd className="text-red-600">{formatDate(usuario.dataExclusao)}</dd>
      </dl>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSoftDelete}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded disabled:opacity-50"
        >
          {deleting ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </div>
  )
}
