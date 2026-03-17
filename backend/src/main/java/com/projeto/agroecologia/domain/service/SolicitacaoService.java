package com.projeto.agroecologia.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.projeto.agroecologia.domain.enume.RoleName;
import com.projeto.agroecologia.domain.enume.SolicitacaoStatus;
import com.projeto.agroecologia.domain.model.Role;
import com.projeto.agroecologia.domain.model.Solicitacao;
import com.projeto.agroecologia.domain.model.User;
import com.projeto.agroecologia.domain.repository.RoleRepository;
import com.projeto.agroecologia.domain.repository.SolicitacaoRepository;
import com.projeto.agroecologia.domain.repository.UserRepository;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.admin.email}")
    private String adminEmail;

    public void criarSolicitacao(User user, String requestedRole) {
        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setUser(user);
        solicitacao.setRequestedRole(requestedRole);
        solicitacao.setStatus(SolicitacaoStatus.PENDING);
        solicitacaoRepository.save(solicitacao);

        emailService.notifyAdmin(adminEmail, user.getUsername(), user.getUsername(), requestedRole);
    }

    public List<Solicitacao> listarPendentes() {
        return solicitacaoRepository.findByStatus(SolicitacaoStatus.PENDING);
    }

    public void aceitar(Long id) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        if (solicitacao.getStatus() != SolicitacaoStatus.PENDING) {
            throw new RuntimeException("Solicitação já foi processada");
        }

        RoleName roleEnum = RoleName.valueOf(solicitacao.getRequestedRole().toUpperCase());
        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Cargo não encontrado"));

        User user = solicitacao.getUser();
        user.getRoles().add(role);
        user.setEnabled(true);
        userRepository.save(user);

        solicitacao.setStatus(SolicitacaoStatus.ACCEPTED);
        solicitacaoRepository.save(solicitacao);

        emailService.sendAcceptedEmail(user.getUsername(), user.getUsername());
    }

    public void negar(Long id) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        if (solicitacao.getStatus() != SolicitacaoStatus.PENDING) {
            throw new RuntimeException("Solicitação já foi processada");
        }

        User user = solicitacao.getUser();

        solicitacao.setStatus(SolicitacaoStatus.DENIED);
        solicitacaoRepository.save(solicitacao);

        emailService.sendDeniedEmail(user.getUsername(), user.getUsername());
    }
}
