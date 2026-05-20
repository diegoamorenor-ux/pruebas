package com.curso.playwright.pages.separated;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

public class MenuLocators {
    private final Page page;

    public MenuLocators(Page page) {
        this.page = page;
    }

    public Locator openNewAccountLink() {
        return page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Open New Account"));
    }
}
