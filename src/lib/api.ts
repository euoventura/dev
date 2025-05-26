import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
})

export default api

export type Usuario = {
  uuid: string
  nome: string
  dataNascimento: string
  idade: number
  email: string
  cpf: string
  hashUsuario: string
  dataCadastro: string
  dataAtualizacao: string
}
