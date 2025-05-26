package com.ventura.usuario1.entity;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, unique = true, updatable = false)
    private UUID uuid;

    @Version
    private Long version;

    @Column(nullable = false)
    private String nome;

    private LocalDate dataNascimento;

    private String email;

    @Column(length = 11, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String hashUsuario;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime dataCadastro;

    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;

    private LocalDateTime dataExclusao;

    public Integer getIdade() {
        if (this.dataNascimento == null) {
            return null;
        }
        return Period.between(this.dataNascimento, LocalDate.now()).getYears();
    }
}
