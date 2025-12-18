package org.example.basicproject.controller;

import org.example.basicproject.domain.Guestbook;
import org.example.basicproject.dto.GuestBookRequest;
import org.example.basicproject.repository.GuestBookRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guestbooks")
@CrossOrigin(origins = "*")//어디서든 오는 요청과 연결시키기.
public class GuestBookController {

    private final GuestBookRepository repository;

    public GuestBookController(GuestBookRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Guestbook> findAll() {
        return repository.findAll();
    }

    @PostMapping
    public Guestbook create(@RequestBody GuestBookRequest request) {
        Guestbook guestbook =
                new Guestbook(request.getNickname(), request.getContent());
        return repository.save(guestbook);
    }
}
