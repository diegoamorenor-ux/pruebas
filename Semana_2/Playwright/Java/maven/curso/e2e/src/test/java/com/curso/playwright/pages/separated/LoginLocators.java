package com.curso.playwright.pages.separated;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

public class LoginLocators {
    public static final String URL = "https://parabank.parasoft.com/parabank/index.htm";

    private final Page page;

    public LoginLocators(Page page) {
        this.page = page;
    }

    public Locator usernameInput() {
        // ParaBank no tiene <label> asociado; por eso este campo queda como CSS.
        return page.locator("input[name='username']");
    }

    public Locator passwordInput() {
        // Los input type=password no siempre exponen un rol util; CSS por name es mas estable aqui.
        return page.locator("input[name='password']");
    }

    public Locator loginButton() {
        return page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Log In"));
    }
}
