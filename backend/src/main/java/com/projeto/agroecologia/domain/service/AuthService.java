package com.projeto.agroecologia.domain.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.projeto.agroecologia.domain.enume.RoleName;
import com.projeto.agroecologia.domain.model.User;
import com.projeto.agroecologia.domain.repository.UserRepository;
import com.projeto.agroecologia.domain.utils.JwtUtils;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private SolicitacaoService solicitacaoService;

    public String login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );
        return jwtUtils.generateToken(authentication);
    }

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
        user.setEnabled(false);
        user.setRoles(new HashSet<>());

        userRepository.save(user);

        solicitacaoService.criarSolicitacao(user, roleStr);
    }

    public List<User> listarUsuarios() {
        return userRepository.findAll();
    }
}