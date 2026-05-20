package com.curso.selenium.tests;

import com.curso.selenium.BaseSeleniumTest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

class LocatorStrategiesTest extends BaseSeleniumTest {
    @Test
    void shouldFindElementsWithTraditionalLocators() {
        driver.get("https://www.selenium.dev/selenium/web/web-form.html");

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
        driver.get("https://www.selenium.dev/selenium/web/web-form.html");

        WebElement stableById = driver.findElement(By.id("my-text-id"));
        WebElement broaderByXpath = driver.findElement(By.xpath("//input[@name='my-text']"));

        stableById.sendKeys("valor estable");

        Assertions.assertEquals(stableById.getAttribute("id"), broaderByXpath.getAttribute("id"));
        Assertions.assertEquals("valor estable", broaderByXpath.getAttribute("value"));
    }
}
