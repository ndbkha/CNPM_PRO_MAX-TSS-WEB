package com.tss.backend.controller;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tss.backend.dto.LoginRequest;
import com.tss.backend.model.User;
import com.tss.backend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Cho phép Frontend gọi API thoải mái (tránh lỗi CORS)
public class AuthController {

    @Autowired
    private AuthService authService;

    // 1. API Đăng nhập (Public - Ai cũng gọi được)
    // URL: http://localhost:8080/api/auth/login
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);
            
            // Trả về thông tin User kèm Token (Ở đây giả lập Token chính là Email)
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", user.getEmail()); // Mock Token
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Nếu sai pass hoặc không tìm thấy user -> Trả về lỗi 401 Unauthorized
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // 2. API Test quyền Admin (Protected - Phải có Token của Admin)
    // URL: http://localhost:8080/api/admin/dashboard
    @GetMapping("/admin/dashboard")
    public ResponseEntity<?> adminDashboard(HttpServletRequest request) {
        // Lấy user đã được Interceptor gắn vào request
        User user = (User) request.getAttribute("currentUser");
        return ResponseEntity.ok("Xin chào Admin: " + user.getFullName() + ". Đây là trang quản trị.");
    }

    // 3. API Test quyền chung (Protected - Ai đăng nhập rồi cũng xem được)
    // URL: http://localhost:8080/api/user/profile
    @GetMapping("/user/profile")
    public ResponseEntity<?> userProfile(HttpServletRequest request) {
        User user = (User) request.getAttribute("currentUser");
        return ResponseEntity.ok(Map.of(
            "message", "Thông tin hồ sơ cá nhân",
            "fullName", user.getFullName(),
            "role", user.getRole(),
            "email", user.getEmail()
        ));
    }
}