package com.tss.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.tss.backend.model.Role;
import com.tss.backend.model.User;
import com.tss.backend.repository.MockUserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private MockUserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. Lấy token
        String token = request.getHeader("Authorization");
        
        if (token == null || token.isEmpty()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing Token");
            return false;
        }

        // 2. Tìm User
        User user = userRepository.findByEmail(token).orElse(null);

        if (user == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Token");
            return false;
        }

        // -------------------------------------------------------------
        // 👇 BỔ SUNG DÒNG NÀY (QUAN TRỌNG NHẤT)
        // Gắn user vào request để Controller phía sau có thể lấy được
        request.setAttribute("currentUser", user);
        // -------------------------------------------------------------

        // 3. Kiểm tra quyền
        String uri = request.getRequestURI();
        if (uri.contains("/admin") && user.getRole() != Role.ADMIN) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Admin only");
            return false;
        }

        return true; 
    }
}