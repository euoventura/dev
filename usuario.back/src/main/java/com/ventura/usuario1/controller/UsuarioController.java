package com.ventura.usuario1.controller;

import com.ventura.usuario1.dto.UsuarioRequestDTO;
import com.ventura.usuario1.dto.UsuarioResponseDTO;
import com.ventura.usuario1.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponseDTO criarUsuario(@Valid @RequestBody UsuarioRequestDTO usuarioRequestDTO) {
        return usuarioService.criarUsuario(usuarioRequestDTO);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarTodosUsuarios() {
        List<UsuarioResponseDTO> usuarios = usuarioService.listarTodosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<UsuarioResponseDTO> buscarUsuarioPorId(@PathVariable UUID uuid) {
        UsuarioResponseDTO usuario = usuarioService.buscarUsuarioPorId(uuid);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<UsuarioResponseDTO> atualizarUsuario(@PathVariable UUID uuid, @Valid @RequestBody UsuarioRequestDTO usuarioRequestDTO) {
        UsuarioResponseDTO usuarioAtualizado = usuarioService.atualizarUsuario(uuid, usuarioRequestDTO);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removerUsuario(@PathVariable UUID uuid) {
        usuarioService.removerUsuario(uuid);
    }
}
