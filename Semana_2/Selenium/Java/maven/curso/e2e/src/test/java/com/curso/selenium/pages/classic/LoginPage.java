package com.curso.selenium.pages.classic;

import com.curso.selenium.evidence.EvidenceSupport;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * POM clasico: localizadores y acciones viven juntos.
 */
public class LoginPage {
    private static final String URL = "https://parabank.parasoft.com/parabank/index.htm";
    private static final By USERNAME_INPUT = By.name("username");
    private static final By PASSWORD_INPUT = By.name("password");
    private static final By LOGIN_BUTTON = By.cssSelector("input[value='Log In']");
    public static final By ERROR_MESSAGE = By.cssSelector("input[value='Log In']");

    private final WebDriver driver;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public LoginPage open() {
        driver.get(URL);
        EvidenceSupport.capture(driver, "parabank-open-login");
        return this;
    }

    public AccountsOverviewPage loginAs(String username, String password) {
        driver.findElement(USERNAME_INPUT).sendKeys(username);
        EvidenceSupport.capture(driver, "parabank-type-username");
        driver.findElement(PASSWORD_INPUT).sendKeys(password);
        EvidenceSupport.capture(driver, "parabank-type-password");
        driver.findElement(LOGIN_BUTTON).click();
        EvidenceSupport.capture(driver, "parabank-click-login");
        return new AccountsOverviewPage(driver);
    }

        public LoginPage loginAsError(String username, String password) {
        driver.findElement(USERNAME_INPUT).sendKeys(username);
        EvidenceSupport.capture(driver, "parabank-type-username");
        driver.findElement(PASSWORD_INPUT).sendKeys(password);
        EvidenceSupport.capture(driver, "parabank-type-password");
        driver.findElement(LOGIN_BUTTON).click();
        EvidenceSupport.capture(driver, "parabank-click-login");
        return this;
    }
}
