package com.izhan.nebula.repository;

import com.izhan.nebula.model.Subject;
import com.izhan.nebula.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// repository which stores StudyContext objects whose IDs are longs
public interface SubjectRepository
        extends JpaRepository<Subject, Long> {

    boolean existsByUserAndNameIgnoreCase(User user, String name);

    List<Subject> findByUserOrderByCreatedAtAsc(User user);

    Optional<Subject> findByIdAndUser(Long id, User user);

}
