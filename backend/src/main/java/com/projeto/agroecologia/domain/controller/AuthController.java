package com.projeto.agroecologia.domain.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.projeto.agroecologia.domain.model.User;
import com.projeto.agroecologia.domain.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public String login(
            @RequestParam String username,
            @RequestParam String password) {

        String token = authService.login(username, password);
        return "🔑 Token: " + token;
    }

    @PostMapping("/register")
    public String register(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam(required = false) List<String> roles) {

        authService.registerUser(username, password, roles);
        return "Usuário Registrado com sucesso!";
    }

    @GetMapping("/usuarios")
    public List<User> listarUsuarios() {
        return authService.listarUsuarios();
    }
}
