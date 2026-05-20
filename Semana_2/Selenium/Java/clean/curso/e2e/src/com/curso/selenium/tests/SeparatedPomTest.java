package com.curso.selenium.tests;

import com.curso.selenium.config.WebDriverFactory;
import com.curso.selenium.pages.separated.WebFormActions;
import com.curso.selenium.pages.separated.WebFormLocators;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

class SeparatedPomTest {
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
    void shouldSubmitTheFormUsingSeparatedPom() {
        WebFormActions form = new WebFormActions(driver);

        form.open();
        form.completeForm("Selenium");

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.textToBePresentInElementLocated(WebFormLocators.RESULT_MESSAGE, "Received!"));

        Assertions.assertEquals("Received!", form.confirmationMessage());
    }
}
