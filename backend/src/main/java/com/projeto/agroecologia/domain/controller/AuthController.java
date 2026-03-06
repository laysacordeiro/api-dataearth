package com.projeto.agroecologia.domain.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.projeto.agroecologia.domain.model.User;
import com.projeto.agroecologia.domain.service.AuthService;
import com.projeto.agroecologia.domain.dto.LoginRequest;
import com.projeto.agroecologia.domain.dto.RegisterRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /* =========================
    LOGIN
    ========================= */
    @PostMapping(value = "/login", consumes = "application/x-www-form-urlencoded")
    public ResponseEntity<Map<String, String>> login(
            @RequestParam String username, // Mudado de @RequestBody para @RequestParam
            @RequestParam String password) {

        String token = authService.login(username, password);
        return ResponseEntity.ok(Map.of("token", token));
    }

    /* =========================
    REGISTRO
    ========================= */
    @PostMapping(value = "/register", consumes = "application/x-www-form-urlencoded")
    public ResponseEntity<?> register(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam List<String> roles) { // Recebe a lista de roles enviada pelo append do Angular

        // Adapte o seu authService para receber a lista ou a primeira role
        authService.registerUser(username, password, roles.get(0)); 

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Usuário registrado com sucesso");
    }

    /* =========================
       LISTAR USUÁRIOS
       (recomendo mover depois)
       ========================= */
    @GetMapping("/usuarios")
    public List<User> listarUsuarios() {
        return authService.listarUsuarios();
    }
}

