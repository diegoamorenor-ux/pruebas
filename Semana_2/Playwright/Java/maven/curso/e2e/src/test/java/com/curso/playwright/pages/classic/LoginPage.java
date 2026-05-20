package com.curso.playwright.pages.classic;

import com.curso.playwright.evidence.EvidenceSupport;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;

/**
 * POM clasico: localizadores y acciones viven juntos.
 */
public class LoginPage {
    private static final String URL = "https://parabank.parasoft.com/parabank/index.htm";

    private final Page page;
    private final Locator usernameInput;
    private final Locator passwordInput;
    private final Locator loginButton;

    public LoginPage(Page page) {
        this.page = page;
        // ParaBank no asocia labels accesibles a estos campos, por eso aqui CSS sigue siendo la opcion clara.
        this.usernameInput = page.locator("input[name='username']");
        this.passwordInput = page.locator("input[name='password']");
        this.loginButton = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Log In"));
    }

    public LoginPage open() {
        page.navigate(URL);
        EvidenceSupport.capture(page, "parabank-open-login");
        return this;
    }

    public AccountsOverviewPage loginAs(String username, String password) {
        usernameInput.fill(username);
        EvidenceSupport.capture(page, "parabank-type-username");
        passwordInput.fill(password);
        EvidenceSupport.capture(page, "parabank-type-password");
        loginButton.click();
        EvidenceSupport.capture(page, "parabank-click-login");
        return new AccountsOverviewPage(page);
    }
}
