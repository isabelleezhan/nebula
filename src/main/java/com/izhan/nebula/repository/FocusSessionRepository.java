package com.izhan.nebula.repository;

import com.izhan.nebula.model.FocusSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FocusSessionRepository
        extends JpaRepository<FocusSession, Long> {
}
