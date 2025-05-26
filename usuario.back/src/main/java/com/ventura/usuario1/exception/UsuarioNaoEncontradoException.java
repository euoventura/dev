package com.ventura.usuario1.exception;


import java.io.Serial;

public class UsuarioNaoEncontradoException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;


    public UsuarioNaoEncontradoException(String message) {
        super(message);
    }

    public UsuarioNaoEncontradoException(String message, Throwable cause) {
        super(message, cause);
    }
}
