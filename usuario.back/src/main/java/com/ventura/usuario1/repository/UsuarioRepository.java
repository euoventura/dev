package com.ventura.usuario1.repository;

import com.ventura.usuario1.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
    List<Usuario> findByDataExclusaoIsNull();
    boolean existsByCpf(String cpf);
}
