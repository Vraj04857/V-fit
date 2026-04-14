// package com.vfit.modules.user.repository;


// import com.vfit.modules.user.entity.User;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// import java.util.Optional;

// @Repository
// public interface UserRepository extends JpaRepository<User, Long> {

//     Optional<User> findByEmail(String email);
//     boolean existsByEmail(String email);
// }

package com.vfit.modules.user.repository;

import com.vfit.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    long countByIsActive(Boolean isActive);
}