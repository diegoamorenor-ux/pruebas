package com.curso.selenium.pages.separated;

import org.openqa.selenium.By;

public final class OpenAccountLocators {
    public static final By ACCOUNT_TYPE_SELECT = By.id("type");
    public static final By FROM_ACCOUNT_OPTIONS = By.cssSelector("#fromAccountId option");
    public static final By OPEN_ACCOUNT_BUTTON = By.cssSelector("input.button[value='Open New Account']");
    public static final By NEW_ACCOUNT_ID = By.id("newAccountId");

    private OpenAccountLocators() {
    }
}
