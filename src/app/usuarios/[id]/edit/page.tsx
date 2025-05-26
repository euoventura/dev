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

export default function UsuarioEditar() {
  const { id } = useParams()
  const router = useRouter()

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    idade: 0,
    email: '',
    cpf: '',
  })

  useEffect(() => {
    if (!id) return
    api.get(`/usuario/${id}`)
      .then(res => {
        setUsuario(res.data)
        setForm({
          nome: res.data.nome,
          dataNascimento: res.data.dataNascimento,
          idade: res.data.idade,
          email: res.data.email,
          cpf: res.data.cpf,
        })
      })
      .catch(() => {
        alert('Erro ao carregar usuário')
        router.push('/usuarios')
      })
      .finally(() => setLoading(false))
  }, [id, router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'idade' ? Number(value) : value }))
  }

  async function handleSave() {
    if (!usuario) return
    setSaving(true)
    try {
      await api.put(`/usuario/${usuario.uuid}`, form)
      alert('Usuário atualizado com sucesso.')
      router.push(`/usuarios/${usuario.uuid}`)
    } catch {
      alert('Erro ao atualizar usuário.')
    } finally {
      setSaving(false)
    }
  }

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
      <h1 className="text-3xl font-bold mb-6 text-center">Editar Usuário</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSave()
        }}
        className="space-y-4"
      >
        <div>
          <label className="block font-semibold mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Data de Nascimento</label>
          <input
            type="date"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Idade</label>
          <input
            type="number"
            name="idade"
            value={form.idade}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            min={0}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">CPF</label>
          <input
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={handleSoftDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded disabled:opacity-50"
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </form>
    </div>
  )
}
