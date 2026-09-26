package com.example.oeqms.controller;

import com.example.oeqms.model.Product;
import com.example.oeqms.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/products")
public class ProductViewController {

    @Autowired
    private ProductRepository repository;

    // LIST all products
    @GetMapping
    public String list(Model model) {
        model.addAttribute("products", repository.findAll());
        return "products/list";
    }

    // Show form to CREATE a new product
    @GetMapping("/new")
    public String newForm(Model model) {
        model.addAttribute("product", new Product());
        return "products/form";
    }

    // Show form to EDIT an existing product
    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        Product product = repository.findById(id).orElseThrow();
        model.addAttribute("product", product);
        return "products/form";
    }

    // SAVE (handles both create and update, since Product has an id field)
    @PostMapping("/save")
    public String save(@ModelAttribute Product product) {
        repository.save(product);
        return "redirect:/products";
    }

    // DELETE
    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        repository.deleteById(id);
        return "redirect:/products";
    }
}