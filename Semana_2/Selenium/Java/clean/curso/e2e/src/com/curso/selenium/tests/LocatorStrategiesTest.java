package com.curso.selenium.tests;

import com.curso.selenium.config.WebDriverFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

class LocatorStrategiesTest {
    private static final String WEB_FORM_URL = "https://www.selenium.dev/selenium/web/web-form.html";

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
    void shouldFindElementsWithTraditionalLocators() {
        driver.get(WEB_FORM_URL);

        WebElement idInput = driver.findElement(By.id("my-text-id"));
        WebElement nameInput = driver.findElement(By.name("my-text"));
        WebElement cssPassword = driver.findElement(By.cssSelector("input[name='my-password']"));
        WebElement xpathTextarea = driver.findElement(By.xpath("//textarea[@name='my-textarea']"));
        WebElement classCheckbox = driver.findElement(By.className("form-check-input"));
        WebElement tagSelect = driver.findElement(By.tagName("select"));
        WebElement linkByText = driver.findElement(By.linkText("Return to index"));
        WebElement linkByPartialText = driver.findElement(By.partialLinkText("Return"));

        Assertions.assertAll(
                () -> Assertions.assertTrue(idInput.isDisplayed()),
                () -> Assertions.assertTrue(nameInput.isDisplayed()),
                () -> Assertions.assertTrue(cssPassword.isDisplayed()),
                () -> Assertions.assertTrue(xpathTextarea.isDisplayed()),
                () -> Assertions.assertTrue(classCheckbox.isDisplayed()),
                () -> Assertions.assertTrue(tagSelect.isDisplayed()),
                () -> Assertions.assertTrue(linkByText.isDisplayed()),
                () -> Assertions.assertTrue(linkByPartialText.isDisplayed())
        );
    }

    @Test
    void shouldCompareStableLocatorVsLessExpressiveLocator() {
        driver.get(WEB_FORM_URL);

        WebElement stableById = driver.findElement(By.id("my-text-id"));
        WebElement broaderByXpath = driver.findElement(By.xpath("//input[@name='my-text']"));

        stableById.sendKeys("valor estable");

        Assertions.assertEquals(stableById.getAttribute("id"), broaderByXpath.getAttribute("id"));
        Assertions.assertEquals("valor estable", broaderByXpath.getAttribute("value"));
    }
}
