package com.projeto.agroecologia.domain.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projeto.agroecologia.domain.enume.RoleName;
import com.projeto.agroecologia.domain.model.Role;
import com.projeto.agroecologia.domain.model.User;
import com.projeto.agroecologia.domain.repository.RoleRepository;
import com.projeto.agroecologia.domain.repository.UserRepository;
import com.projeto.agroecologia.domain.utils.JwtUtils;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    /* =========================
       LOGIN
       ========================= */
    public String login(String username, String password) {

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );

        // ✅ Token deve ser gerado a partir do Authentication
        return jwtUtils.generateToken(authentication);
    }

    /* =========================
       REGISTRO
       ========================= */
    public void registerUser(String username, String password, String roleStr) {

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Usuário já existe");
        }

        RoleName roleEnum;
        try {
            roleEnum = RoleName.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Cargo inválido");
        }

        if (roleEnum == RoleName.ROLE_ADMIN) {
            throw new RuntimeException("Cargo não permitido no cadastro");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));

        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Cargo não encontrado"));

        user.setRoles(Set.of(role));

        userRepository.save(user);
    }

    /* =========================
       LISTAGEM (recomendo mover depois)
       ========================= */
    public List<User> listarUsuarios() {
        return userRepository.findAll();
    }
}