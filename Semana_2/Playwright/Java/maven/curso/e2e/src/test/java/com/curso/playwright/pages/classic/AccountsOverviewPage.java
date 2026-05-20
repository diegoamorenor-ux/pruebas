package com.curso.playwright.pages.classic;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

public class AccountsOverviewPage {
    private final Locator title;
    private final Locator accountsTable;

    public AccountsOverviewPage(Page page) {
        this.title = page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Accounts Overview"));
        this.accountsTable = page.getByRole(AriaRole.TABLE);
    }

    public String title() {
        title.waitFor();
        return title.innerText().trim();
    }

    public boolean hasAccountsTable() {
        accountsTable.waitFor();
        return accountsTable.isVisible();
    }
}
