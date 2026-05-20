package com.curso.selenium.pages.separated;

import com.curso.selenium.evidence.EvidenceSupport;
import org.openqa.selenium.WebDriver;

public class LoginActions {
    private final WebDriver driver;

    public LoginActions(WebDriver driver) {
        this.driver = driver;
    }

    public LoginActions open() {
        driver.get(LoginLocators.URL);
        EvidenceSupport.capture(driver, "parabank-separated-open-login");
        return this;
    }

    public void loginAs(String username, String password) {
        driver.findElement(LoginLocators.USERNAME_INPUT).sendKeys(username);
        EvidenceSupport.capture(driver, "parabank-separated-type-username");
        driver.findElement(LoginLocators.PASSWORD_INPUT).sendKeys(password);
        EvidenceSupport.capture(driver, "parabank-separated-type-password");
        driver.findElement(LoginLocators.LOGIN_BUTTON).click();
        EvidenceSupport.capture(driver, "parabank-separated-click-login");
    }
}
