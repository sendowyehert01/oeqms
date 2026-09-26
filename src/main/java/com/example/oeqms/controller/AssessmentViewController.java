package com.example.oeqms.controller;

import com.example.oeqms.model.Assessment;
import com.example.oeqms.repository.AssessmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/assessments")
public class AssessmentViewController {

    @Autowired
    private AssessmentRepository repository;

    @GetMapping
    public String list(Model model) {
        model.addAttribute("assessments", repository.findAll());
        return "assessments/list";
    }

    @GetMapping("/new")
    public String newForm(Model model) {
        addFormOptions(model);
        model.addAttribute("assessment", new Assessment());
        return "assessments/form";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        addFormOptions(model);
        model.addAttribute("assessment", repository.findById(id).orElseThrow());
        return "assessments/form";
    }

    @PostMapping("/save")
    public String save(@ModelAttribute Assessment assessment) {
        repository.save(assessment);
        return "redirect:/assessments";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "redirect:/assessments";
    }

    private void addFormOptions(Model model) {
        model.addAttribute("assessmentTypes", Assessment.Type.values());
        model.addAttribute("assessmentStatuses", Assessment.Status.values());
    }
}