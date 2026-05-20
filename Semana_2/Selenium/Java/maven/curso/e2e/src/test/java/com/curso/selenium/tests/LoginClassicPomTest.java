package com.curso.selenium.tests;

import com.curso.selenium.BaseSeleniumTest;
import com.curso.selenium.pages.classic.AccountsOverviewPage;
import com.curso.selenium.pages.classic.LoginPage;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class LoginClassicPomTest extends BaseSeleniumTest {
    @Test
    void shouldLoginUsingClassicPom() {
        AccountsOverviewPage overview = new LoginPage(driver)
                .open()
                .loginAs("john", "demo");

        Assertions.assertEquals("Accounts Overview", overview.title());
        Assertions.assertTrue(overview.hasAccountsTable());
    }
}
