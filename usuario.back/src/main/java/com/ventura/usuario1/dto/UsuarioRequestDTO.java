package com.ventura.usuario1.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UsuarioRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 255, message = "Nome não pode exceder 255 caracteres")
    private String nome;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "Data de nascimento deve ser no passado")
    private LocalDate dataNascimento;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Formato de email inválido")
    @Size(max = 100, message = "Email não pode exceder 100 caracteres")
    private String email;

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

}


