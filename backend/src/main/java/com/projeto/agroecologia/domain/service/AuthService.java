package com.projeto.agroecologia.domain.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
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
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

        public String login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return jwtUtils.generateToken(userDetails);
    }

    public List<User> listarUsuarios() {
        return userRepository.findAll();
    }

public void registerUser(String username, String password, List<String> roleNames) {
    User user = new User();
    user.setUsername(username);
    user.setPassword(passwordEncoder.encode(password));

    Set<Role> roles = new HashSet<>();
    Role defaultRole = roleRepository.findByName(RoleName.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("Cargo não encontrado: ROLE_USER"));
    roles.add(defaultRole);

    // 2. Convert incoming Strings to Role Entities
    if (roleNames != null && !roleNames.isEmpty()) {
        for (String roleNameStr : roleNames) {
            try {
                RoleName roleEnum = RoleName.valueOf(roleNameStr.toUpperCase());
                Role additionalRole = roleRepository.findByName(roleEnum)
                        .orElseThrow(() -> new RuntimeException("Cargo não encontrado: " + roleNameStr));
                
                roles.add(additionalRole);
            } catch (IllegalArgumentException e) {
                System.out.println("Cargo não existe/encontrado " + roleNameStr);
            }
        }
    }

    user.setRoles(roles);
    userRepository.save(user);
}
}
