package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(UUID id);
    User createUser(UserDTO userDTO);
    User updateUser(UUID id, UserDTO userDTO);
    void deleteUser(UUID id);
}
