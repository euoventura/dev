package com.ventura.usuario1.service;

import com.ventura.usuario1.entity.Usuario;
import com.ventura.usuario1.dto.UsuarioRequestDTO;
import com.ventura.usuario1.dto.UsuarioResponseDTO;
import com.ventura.usuario1.exception.UsuarioNaoEncontradoException;
import com.ventura.usuario1.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private UsuarioResponseDTO convertToResponseDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .uuid(usuario.getUuid())
                .nome(usuario.getNome())
                .dataNascimento(usuario.getDataNascimento())
                .idade(usuario.getDataNascimento() != null ?
                        Period.between(usuario.getDataNascimento(), LocalDate.now()).getYears() : null)
                .email(usuario.getEmail())
                .cpf(usuario.getCpf())
                .hashUsuario(usuario.getHashUsuario())
                .dataCadastro(usuario.getDataCadastro())
                .dataAtualizacao(usuario.getDataAtualizacao())
                .build();
    }

    private Usuario convertToEntity(UsuarioRequestDTO dto) {
        return Usuario.builder()
                .nome(dto.getNome())
                .dataNascimento(dto.getDataNascimento())
                .email(dto.getEmail())
                .cpf(dto.getCpf())
                .build();
    }

    private String gerarHashUsuario(Usuario usuario) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String dataToHash = String.valueOf(usuario.getNome()) +
                    String.valueOf(usuario.getCpf()) +
                    String.valueOf(usuario.getEmail()) +
                    String.valueOf(usuario.getDataNascimento());
            byte[] hash = digest.digest(dataToHash.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao gerar hash do usuário: Algoritmo SHA-256 não encontrado.", e);
        }
    }

    @Transactional
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO usuarioRequestDTO) {
        if (usuarioRepository.existsByCpf(usuarioRequestDTO.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        Usuario usuario = convertToEntity(usuarioRequestDTO);
        usuario.setHashUsuario(gerarHashUsuario(usuario));

        Usuario novoUsuario;
        try {
            novoUsuario = usuarioRepository.save(usuario);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Erro de integridade nos dados: " + e.getMessage());
        }

        return convertToResponseDTO(novoUsuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarTodosUsuarios() {
        return usuarioRepository.findByDataExclusaoIsNull().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarUsuarioPorId(UUID uuid) {
        Usuario usuario = usuarioRepository.findById(uuid)
                .filter(u -> u.getDataExclusao() == null)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado. ID: " + uuid));
        return convertToResponseDTO(usuario);
    }

    @Transactional
    public UsuarioResponseDTO atualizarUsuario(UUID uuid, UsuarioRequestDTO usuarioRequestDTO) {
        Usuario usuarioExistente = usuarioRepository.findById(uuid)
                .filter(u -> u.getDataExclusao() == null)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado para atualização. ID: " + uuid));

        if (!usuarioExistente.getCpf().equals(usuarioRequestDTO.getCpf()) &&
                usuarioRepository.existsByCpf(usuarioRequestDTO.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado para outro usuário.");
        }

        usuarioExistente.setNome(usuarioRequestDTO.getNome());
        usuarioExistente.setDataNascimento(usuarioRequestDTO.getDataNascimento());
        usuarioExistente.setEmail(usuarioRequestDTO.getEmail());
        usuarioExistente.setCpf(usuarioRequestDTO.getCpf());
        usuarioExistente.setHashUsuario(gerarHashUsuario(usuarioExistente));

        Usuario atualizado = usuarioRepository.save(usuarioExistente);
        return convertToResponseDTO(atualizado);
    }

    @Transactional
    public void removerUsuario(UUID uuid) {
        Usuario usuario = usuarioRepository.findById(uuid)
                .filter(u -> u.getDataExclusao() == null)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado para exclusão. ID: " + uuid));

        usuario.setDataExclusao(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }
}
