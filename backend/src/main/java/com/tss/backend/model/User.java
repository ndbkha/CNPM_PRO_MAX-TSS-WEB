package com.tss.backend.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Lombok tự sinh Getter/Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private String id;
    private String email;
    private String password;
    private String fullName;
    private Role role;
}
