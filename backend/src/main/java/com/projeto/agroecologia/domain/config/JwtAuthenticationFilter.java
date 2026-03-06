package com.projeto.agroecologia.domain.config;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.projeto.agroecologia.domain.utils.JwtUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath().toLowerCase();

        return path.startsWith("/auth/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            try {
                if (jwtUtils.validateToken(token)) {

                    String username = jwtUtils.extractUsername(token);

                    List<SimpleGrantedAuthority> authorities =
                        jwtUtils.extractRoles(token)
                            .stream()
                            .map(SimpleGrantedAuthority::new)
                            .toList();

                        System.out.println("AUTHORITIES NO FILTRO = " + authorities);
                        System.out.println(">>> PATH = " + request.getServletPath());
                        System.out.println(">>> AUTH HEADER = " + request.getHeader("Authorization"));

                    UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            authorities
                        );

                    authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
                System.out.println(">>> TOKEN VALID = " + jwtUtils.validateToken(token));
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
            }
        }
        var auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(">>> AUTH FINAL = " + auth);

        chain.doFilter(request, response);
    }
}

