package com.curso.selenium.pages.separated;

import com.curso.selenium.evidence.EvidenceSupport;
import org.openqa.selenium.WebDriver;

/**
 * POM separado: esta clase solo sabe que hacer con los elementos.
 */
public class WebFormActions {
    private final WebDriver driver;

    public WebFormActions(WebDriver driver) {
        this.driver = driver;
    }

    public void open() {
        driver.get(WebFormLocators.URL);
        EvidenceSupport.capture(driver, "webform-separated-open");
    }

    public void completeForm(String value) {
        driver.findElement(WebFormLocators.NAME_FIELD).sendKeys(value);
        EvidenceSupport.capture(driver, "webform-separated-type-name");
        driver.findElement(WebFormLocators.SUBMIT_BUTTON).click();
        EvidenceSupport.capture(driver, "webform-separated-submit");
    }

    public String confirmationMessage() {
        return driver.findElement(WebFormLocators.RESULT_MESSAGE).getText();
    }
}
