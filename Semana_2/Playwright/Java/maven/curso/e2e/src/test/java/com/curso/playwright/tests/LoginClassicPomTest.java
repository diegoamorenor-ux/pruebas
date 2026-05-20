package com.curso.playwright.tests;

import com.curso.playwright.BasePlaywrightTest;
import com.curso.playwright.pages.classic.AccountsOverviewPage;
import com.curso.playwright.pages.classic.LoginPage;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class LoginClassicPomTest extends BasePlaywrightTest {
    @Test
    void shouldLoginUsingClassicPom() {
        AccountsOverviewPage overview = new LoginPage(page)
                .open()
                .loginAs("john", "demo");

        Assertions.assertEquals("Accounts Overview", overview.title());
        Assertions.assertTrue(overview.hasAccountsTable());
    }
}
