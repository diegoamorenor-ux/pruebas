package com.curso.playwright.pages.separated;

import com.curso.playwright.evidence.EvidenceSupport;
import com.microsoft.playwright.Page;

public class MenuActions {
    private final Page page;
    private final MenuLocators locators;

    public MenuActions(Page page) {
        this.page = page;
        this.locators = new MenuLocators(page);
    }

    public void openNewAccount() {
        locators.openNewAccountLink().click();
        EvidenceSupport.capture(page, "parabank-separated-open-new-account");
    }
}
