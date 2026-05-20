package com.curso.selenium.tests;

import com.curso.selenium.config.WebDriverFactory;
import com.curso.selenium.pages.WebFormPage;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

class ClassicPomTest {
    private WebDriver driver;

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

    @Test
    void shouldSubmitTheFormUsingClassicPom() {
        WebFormPage page = new WebFormPage(driver);

        page.open();
        page.completeForm("Selenium");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(page.resultMessageLocator(), "Received!"));

        Assertions.assertEquals("Received!", page.readMessage());
    }
}
