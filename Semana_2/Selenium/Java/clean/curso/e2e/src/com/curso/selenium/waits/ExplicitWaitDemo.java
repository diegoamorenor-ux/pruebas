package com.curso.selenium.waits;

import com.curso.selenium.config.WebDriverFactory;
import com.curso.selenium.pages.WebFormPage;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class ExplicitWaitDemo {
    private static final Duration EXPLICIT_WAIT = Duration.ofSeconds(10);

    public String run(String value) {
        WebDriver driver = WebDriverFactory.createChromeDriver();

        try {
            WebFormPage page = new WebFormPage(driver);
            page.open();
            page.typeName(value);
            page.submit();

            WebDriverWait wait = new WebDriverWait(driver, EXPLICIT_WAIT);
            wait.until(ExpectedConditions.textToBePresentInElementLocated(page.resultMessageLocator(), "Received!"));

            return page.readMessage();
        } finally {
            driver.quit();
        }
    }
}