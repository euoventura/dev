'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function NovoUsuario() {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '',
    dataNascimento: '',
    email: '',
    cpf: ''
  })

  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.nome || !form.dataNascimento || !form.email || !form.cpf) {
      alert('Preencha todos os campos obrigatórios.')
      return
    }

    setLoading(true)
    try {
      await api.post('/usuario', {
        nome: form.nome,
        dataNascimento: form.dataNascimento,
        email: form.email,
        cpf: form.cpf
      })
      alert('Usuário cadastrado com sucesso!')
      router.push('/usuarios')
    } catch (error) {
      alert('Erro ao cadastrar usuário.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8 text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">Cadastrar Novo Usuário</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block font-semibold mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="dataNascimento" className="block font-semibold mb-1">Data de Nascimento</label>
          <input
            type="date"
            name="dataNascimento"
            id="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="cpf" className="block font-semibold mb-1">CPF</label>
          <input
            type="text"
            name="cpf"
            id="cpf"
            value={form.cpf}
            onChange={handleChange}
            placeholder="Somente números"
            maxLength={11}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  )
}
