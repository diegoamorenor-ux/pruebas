package com.curso.playwright.pages.separated;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

public class OpenAccountLocators {
    private final Page page;

    public OpenAccountLocators(Page page) {
        this.page = page;
    }

    public Locator accountTypeSelect() {
        return page.getByRole(AriaRole.COMBOBOX).first();
    }

    public Locator fromAccountOptions() {
        return page.locator("#fromAccountId option");
    }

    public Locator openAccountButton() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Open New Account"));
    }

    public Locator newAccountId() {
        return page.locator("#newAccountId");
    }
}
