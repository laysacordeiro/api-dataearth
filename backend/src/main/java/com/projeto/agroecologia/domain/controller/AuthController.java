package com.projeto.agroecologia.domain.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.projeto.agroecologia.domain.model.User;
import com.projeto.agroecologia.domain.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping(value = "/login", consumes = "application/x-www-form-urlencoded")
    public ResponseEntity<Map<String, String>> login(
            @RequestParam("username") String username,
            @RequestParam("password") String password) {

        String token = authService.login(username, password);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping(value = "/register", consumes = "application/x-www-form-urlencoded")
    public ResponseEntity<?> register(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("roles") List<String> roles) {

        authService.registerUser(username, password, roles.get(0));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Solicitação de acesso enviada. Aguarde a aprovação do administrador.");
    }

    @GetMapping("/usuarios")
    public List<User> listarUsuarios() {
        return authService.listarUsuarios();
    }
}
