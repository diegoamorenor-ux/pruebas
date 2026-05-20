package com.curso.selenium.pages.separated;

import com.curso.selenium.evidence.EvidenceSupport;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class OpenAccountActions {
    private final WebDriver driver;
    private final WebDriverWait wait;

    public OpenAccountActions(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public String openSavingsAccount() {
        wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(OpenAccountLocators.FROM_ACCOUNT_OPTIONS, 0));
        new Select(driver.findElement(OpenAccountLocators.ACCOUNT_TYPE_SELECT)).selectByVisibleText("SAVINGS");
        EvidenceSupport.capture(driver, "parabank-separated-select-savings");
        driver.findElement(OpenAccountLocators.OPEN_ACCOUNT_BUTTON).click();
        EvidenceSupport.capture(driver, "parabank-separated-click-open-account");
        String accountId = wait.until(ExpectedConditions.visibilityOfElementLocated(OpenAccountLocators.NEW_ACCOUNT_ID)).getText();
        EvidenceSupport.capture(driver, "parabank-separated-account-created");
        return accountId;
    }
}
