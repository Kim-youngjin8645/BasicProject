package org.example.basicproject.repository;

import org.example.basicproject.domain.Guestbook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestBookRepository extends JpaRepository<Guestbook,Long> {
}
