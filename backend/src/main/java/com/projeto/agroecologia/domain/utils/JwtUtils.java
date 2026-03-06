package com.projeto.agroecologia.domain.utils;

import java.security.Key;
import java.util.Date;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    private static final String SECRET_KEY =
        "cXVlbS1sZS1zZW1wcmUtZ2FuaGEtcXVlbS1jYWl1LWFzc2ltLWxldmFudGEK";

    private static final long EXPIRATION_TIME = 86400000; // 1 dia

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    /* =========================
       GERAR TOKEN
       ========================= */
    public String generateToken(Authentication authentication) {

        return Jwts.builder()
                .setSubject(authentication.getName())
                .claim(
                    "roles",
                    authentication.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList()
                )
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /* =========================
       VALIDAÇÃO
       ========================= */
    public boolean validateToken(String token) {
        try {
            return !isExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /* =========================
       EXTRAÇÕES
       ========================= */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public List<String> extractRoles(String token) {
        return extractAllClaims(token).get("roles", List.class);
    }

    /* =========================
       MÉTODOS INTERNOS
       ========================= */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }
}