package com.projeto.agroecologia.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    private void send(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    @Async
    public void notifyAdmin(String adminEmail, String username, String userEmail, String requestedRole) {
        String subject = "Nova solicitação de acesso - " + username;
        String body = "O usuário '" + username + "' (" + userEmail + ") solicitou acesso com o cargo: " + requestedRole
                + ".\n\n"
                + "Acesse o sistema de administração para aceitar ou negar a solicitação.";
        send(adminEmail, subject, body);
    }

    @Async
    public void sendAcceptedEmail(String to, String username) {
        String subject = "Seu acesso foi aprovado!";
        String body = "Olá, " + username + "!\n\n"
                + "Sua solicitação de acesso ao sistema DataEarth foi APROVADA.\n"
                + "Você já pode fazer login com suas credenciais.\n\n"
                + "Bem-vindo(a)!";
        send(to, subject, body);
    }

    @Async
    public void sendDeniedEmail(String to, String username) {
        String subject = "Solicitação de acesso negada";
        String body = "Olá, " + username + "!\n\n"
                + "Infelizmente, sua solicitação de acesso ao sistema DataEarth foi NEGADA.\n"
                + "Entre em contato com o administrador para mais informações.";
        send(to, subject, body);
    }
}
