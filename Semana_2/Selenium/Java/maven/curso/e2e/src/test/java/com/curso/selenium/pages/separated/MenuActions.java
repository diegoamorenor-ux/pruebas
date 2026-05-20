package com.curso.selenium.pages.separated;

import com.curso.selenium.evidence.EvidenceSupport;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class MenuActions {
    private final WebDriver driver;
    private final WebDriverWait wait;

    public MenuActions(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void openNewAccount() {
        wait.until(ExpectedConditions.elementToBeClickable(MenuLocators.OPEN_NEW_ACCOUNT_LINK)).click();
        EvidenceSupport.capture(driver, "parabank-separated-open-new-account");
    }
}
