package com.izhan.nebula.repository;

import com.izhan.nebula.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

// repository which stores StudyContext objects whose IDs are longs
public interface SubjectRepository
        extends JpaRepository<Subject, Long> {
    boolean existsByNameIgnoreCase(String name);
}
