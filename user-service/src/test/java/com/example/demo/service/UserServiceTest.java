package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.impl.UserServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private UserDTO userDTO;
    private final UUID userId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        userDTO = new UserDTO();
        userDTO.setUsername("testuser");
        userDTO.setEmail("test@example.com");
        userDTO.setPassword("password123");

        user = User.builder()
                .id(userId)
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .password(userDTO.getPassword())
                .build();
    }

    @Test
    void whenGetAllUsers_thenReturnUsersList() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user));
        
        List<User> found = userService.getAllUsers();
        
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getUsername()).isEqualTo(user.getUsername());
        verify(userRepository).findAll();
    }

    @Test
    void whenGetUserById_thenReturnUser() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        
        User found = userService.getUserById(userId);
        
        assertThat(found.getUsername()).isEqualTo(user.getUsername());
        verify(userRepository).findById(userId);
    }

    @Test
    void whenGetUserByInvalidId_thenThrowException() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());
        
        assertThrows(EntityNotFoundException.class, () -> userService.getUserById(userId));
        verify(userRepository).findById(userId);
    }

    @Test
    void whenCreateUser_thenReturnNewUser() {
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        User created = userService.createUser(userDTO);
        
        assertThat(created.getUsername()).isEqualTo(userDTO.getUsername());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void whenUpdateUser_thenReturnUpdatedUser() {
        UserDTO updateDTO = new UserDTO();
        updateDTO.setUsername("updated");
        updateDTO.setEmail("updated@example.com");
        updateDTO.setPassword("newpassword123");

        User updatedUser = User.builder()
                .id(userId)
                .username(updateDTO.getUsername())
                .email(updateDTO.getEmail())
                .password(updateDTO.getPassword())
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        User result = userService.updateUser(userId, updateDTO);

        assertThat(result.getUsername()).isEqualTo(updateDTO.getUsername());
        assertThat(result.getEmail()).isEqualTo(updateDTO.getEmail());
        verify(userRepository).findById(userId);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void whenDeleteUser_thenSuccess() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        doNothing().when(userRepository).delete(user);

        userService.deleteUser(userId);

        verify(userRepository).findById(userId);
        verify(userRepository).delete(user);
    }
}
