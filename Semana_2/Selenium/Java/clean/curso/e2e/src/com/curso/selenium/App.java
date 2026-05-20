package com.curso.selenium;

import com.curso.selenium.waits.ExplicitWaitDemo;
import com.curso.selenium.waits.ImplicitWaitDemo;

public class App {
    public static void main(String[] args) {
        runImplicitWaitExample();
        runExplicitWaitExample();
    }

    private static void runImplicitWaitExample() {
        System.out.println("=== Espera implícita ===");
        System.out.println(new ImplicitWaitDemo().run("Selenium"));
    }

    private static void runExplicitWaitExample() {
        System.out.println("=== Espera explícita ===");
        System.out.println(new ExplicitWaitDemo().run("Selenium"));
    }
}