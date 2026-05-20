package com.curso.playwright.pages.separated;

import com.curso.playwright.evidence.EvidenceSupport;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.SelectOption;
import com.microsoft.playwright.options.WaitForSelectorState;

public class OpenAccountActions {
    private final Page page;
    private final OpenAccountLocators locators;

    public OpenAccountActions(Page page) {
        this.page = page;
        this.locators = new OpenAccountLocators(page);
    }

    public String openSavingsAccount() {
        locators.fromAccountOptions().first().waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.ATTACHED));
        locators.accountTypeSelect().selectOption(new SelectOption().setLabel("SAVINGS"));
        EvidenceSupport.capture(page, "parabank-separated-select-savings");
        locators.openAccountButton().click();
        EvidenceSupport.capture(page, "parabank-separated-click-open-account");
        locators.newAccountId().waitFor();
        String accountId = locators.newAccountId().innerText().trim();
        EvidenceSupport.capture(page, "parabank-separated-account-created");
        return accountId;
    }
}
