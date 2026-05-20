package com.curso.selenium.pages.classic;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class AccountsOverviewPage {
    private static final By TITLE = By.cssSelector("#rightPanel h1.title");
    private static final By ACCOUNTS_TABLE = By.id("accountTable");

    private final WebDriver driver;
    private final WebDriverWait wait;

    public AccountsOverviewPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public String title() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(TITLE)).getText();
    }

    public boolean hasAccountsTable() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(ACCOUNTS_TABLE)).isDisplayed();
    }
}
