package com.ventura.usuario1.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDTO {
    private UUID uuid;
    private String nome;
    private LocalDate dataNascimento;
    private Integer idade;
    private String email;
    private String cpf;
    private String hashUsuario;
    private LocalDateTime dataCadastro;
    private LocalDateTime dataAtualizacao;
}
