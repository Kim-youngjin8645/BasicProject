package org.example.basicproject.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Guestbook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nickname;

    @Column(length = 1000)
    private String content;
    private LocalDateTime createdAt;

    public Guestbook(String nickname, String content) {
        this.nickname = nickname;
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }
}
