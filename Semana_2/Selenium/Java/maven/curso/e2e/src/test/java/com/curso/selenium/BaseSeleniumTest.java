package com.curso.selenium;

import com.curso.selenium.config.WebDriverFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;

public abstract class BaseSeleniumTest {
    protected WebDriver driver;

    @BeforeEach
    void openBrowser() {
        driver = WebDriverFactory.createChromeDriver();
    }

    @AfterEach
    void closeBrowser() {
        if (driver != null) {
            driver.quit();
        }
    }
}
