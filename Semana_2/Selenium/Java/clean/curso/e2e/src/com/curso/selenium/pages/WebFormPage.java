package com.curso.selenium.pages;

import com.curso.selenium.evidence.EvidenceSupport;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * POM clasico: los localizadores y las acciones viven en la misma clase.
 */
public class WebFormPage {
    private static final String WEB_FORM_URL = "https://www.selenium.dev/selenium/web/web-form.html";
    private static final By NAME_FIELD = By.name("my-text");
    private static final By SUBMIT_BUTTON = By.cssSelector("button");
    private static final By RESULT_MESSAGE = By.id("message");

    private final WebDriver driver;

    public WebFormPage(WebDriver driver) {
        this.driver = driver;
    }

    public void open() {
        driver.get(WEB_FORM_URL);
        EvidenceSupport.capture(driver, "webform-open");
    }

    public void completeForm(String value) {
        typeName(value);
        submit();
    }

    public void typeName(String value) {
        driver.findElement(NAME_FIELD).sendKeys(value);
        EvidenceSupport.capture(driver, "webform-type-name");
    }

    public void submit() {
        driver.findElement(SUBMIT_BUTTON).click();
        EvidenceSupport.capture(driver, "webform-submit");
    }

    public String readMessage() {
        return driver.findElement(RESULT_MESSAGE).getText();
    }

    public By resultMessageLocator() {
        return RESULT_MESSAGE;
    }
}
