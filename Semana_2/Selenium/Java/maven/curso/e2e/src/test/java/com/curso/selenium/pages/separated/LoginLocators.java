package com.curso.selenium.pages.separated;

import org.openqa.selenium.By;

public final class LoginLocators {
    public static final String URL = "https://parabank.parasoft.com/parabank/index.htm";
    public static final By USERNAME_INPUT = By.name("username");
    public static final By PASSWORD_INPUT = By.name("password");
    public static final By LOGIN_BUTTON = By.cssSelector("input[value='Log In']");

    private LoginLocators() {
    }
}
