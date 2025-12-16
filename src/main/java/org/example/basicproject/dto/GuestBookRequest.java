package org.example.basicproject.dto;

import lombok.Getter;

@Getter
public class GuestBookRequest {
    private String nickname;
    private String content;
}
