package com.curso.playwright.pages.separated;

import com.curso.playwright.evidence.EvidenceSupport;
import com.microsoft.playwright.Page;

public class LoginActions {
    private final Page page;
    private final LoginLocators locators;

    public LoginActions(Page page) {
        this.page = page;
        this.locators = new LoginLocators(page);
    }

    public LoginActions open() {
        page.navigate(LoginLocators.URL);
        EvidenceSupport.capture(page, "parabank-separated-open-login");
        return this;
    }

    public void loginAs(String username, String password) {
        locators.usernameInput().fill(username);
        EvidenceSupport.capture(page, "parabank-separated-type-username");
        locators.passwordInput().fill(password);
        EvidenceSupport.capture(page, "parabank-separated-type-password");
        locators.loginButton().click();
        EvidenceSupport.capture(page, "parabank-separated-click-login");
    }
}
