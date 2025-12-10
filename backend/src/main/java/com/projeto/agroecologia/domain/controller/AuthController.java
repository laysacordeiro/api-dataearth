package com.projeto.agroecologia.domain.controller;

import com.projeto.agroecologia.domain.model.Auth;
import com.projeto.agroecologia.domain.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody Auth auth) {
        Auth saved = authService.saveUser(auth.getFullName(), auth.getEmail(), auth.getPassword());
        if (saved != null) {
            return ResponseEntity.ok("User registered");
        } else {
            return ResponseEntity.badRequest().body("Email already registered");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Auth auth) {
        if (authService.login(auth.getEmail(), auth.getPassword())) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
    @GetMapping("/users")
    public ResponseEntity<List<Auth>> getAllUsers() {
    List<Auth> users = authService.findAllUsers();
    return ResponseEntity.ok(users);
}
}
