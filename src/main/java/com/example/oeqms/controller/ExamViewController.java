package com.example.oeqms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/exam")
public class ExamViewController {

    @GetMapping({"", "/", "/index"})
    public String index() {
        return "exam/index";
    }
}
