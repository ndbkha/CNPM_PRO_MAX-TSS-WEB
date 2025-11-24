package com.tss.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tss.backend.dto.LoginRequest;
import com.tss.backend.model.User;
import com.tss.backend.repository.MockUserRepository;

@Service
public class AuthService {

    @Autowired
    private MockUserRepository userRepository;

    public User login(LoginRequest request) {
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Kiểm tra mật khẩu (Mock nên so sánh chuỗi thường)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        // 3. Trả về thông tin User (Trong thực tế sẽ trả về JWT Token)
        return user;
    }
}