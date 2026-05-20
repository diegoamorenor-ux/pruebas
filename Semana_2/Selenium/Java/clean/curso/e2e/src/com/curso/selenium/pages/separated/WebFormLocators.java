package com.curso.selenium.pages.separated;

import org.openqa.selenium.By;

/**
 * POM separado: esta clase solo sabe donde estan los elementos.
 */
public final class WebFormLocators {
    public static final String URL = "https://www.selenium.dev/selenium/web/web-form.html";
    public static final By NAME_FIELD = By.name("my-text");
    public static final By SUBMIT_BUTTON = By.cssSelector("button");
    public static final By RESULT_MESSAGE = By.id("message");

    private WebFormLocators() {
    }
}
