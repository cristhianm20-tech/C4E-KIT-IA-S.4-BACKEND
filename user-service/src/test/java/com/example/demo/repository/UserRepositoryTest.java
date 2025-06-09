package com.example.demo.repository;

import com.example.demo.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void whenSaveUser_thenReturnUser() {
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password123")
                .build();

        User savedUser = userRepository.save(user);
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getCreatedAt()).isNotNull();
    }

    @Test
    void whenExistsByUsername_thenReturnTrue() {
        User user = User.builder()
                .username("existinguser")
                .email("existing@example.com")
                .password("password123")
                .build();

        entityManager.persist(user);

        boolean exists = userRepository.existsByUsername("existinguser");
        assertThat(exists).isTrue();
    }

    @Test
    void whenExistsByEmail_thenReturnTrue() {
        User user = User.builder()
                .username("emailuser")
                .email("existing@example.com")
                .password("password123")
                .build();

        entityManager.persist(user);

        boolean exists = userRepository.existsByEmail("existing@example.com");
        assertThat(exists).isTrue();
    }
}
