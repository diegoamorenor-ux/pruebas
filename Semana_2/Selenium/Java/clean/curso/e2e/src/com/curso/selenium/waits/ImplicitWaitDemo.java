package com.curso.selenium.waits;

import com.curso.selenium.config.WebDriverFactory;
import com.curso.selenium.pages.WebFormPage;
import org.openqa.selenium.WebDriver;

import java.time.Duration;

public class ImplicitWaitDemo {
    private static final Duration IMPLICIT_WAIT = Duration.ofSeconds(30);

    public String run(String value) {
        WebDriver driver = WebDriverFactory.createChromeDriver();

        try {
            driver.manage().timeouts().implicitlyWait(IMPLICIT_WAIT);

            WebFormPage page = new WebFormPage(driver);
            page.open();
            page.typeName(value);
            page.submit();

            return page.readMessage();
        } finally {
            driver.quit();
        }
    }
}