package com.tss.backend.repository;

import com.tss.backend.model.Role;
import com.tss.backend.model.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class MockUserRepository {
    private static final List<User> USERS = new ArrayList<>();

    // Khởi tạo dữ liệu mẫu
    static {
        USERS.add(new User("1", "student@bk.edu.vn", "123", "Nguyen Van A", Role.STUDENT));
        USERS.add(new User("2", "tutor@bk.edu.vn", "123", "Le Thi B", Role.TUTOR));
        USERS.add(new User("3", "admin@bk.edu.vn", "123", "Quan Tri Vien", Role.ADMIN));
        USERS.add(new User("4", "coord@bk.edu.vn", "123", "Dieu Phoi Vien", Role.COORDINATOR));
    }

    public Optional<User> findByEmail(String email) {
        return USERS.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }
}