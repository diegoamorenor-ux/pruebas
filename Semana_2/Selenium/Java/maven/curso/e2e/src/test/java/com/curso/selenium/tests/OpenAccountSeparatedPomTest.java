package com.curso.selenium.tests;

import com.curso.selenium.BaseSeleniumTest;
import com.curso.selenium.pages.separated.LoginActions;
import com.curso.selenium.pages.separated.MenuActions;
import com.curso.selenium.pages.separated.OpenAccountActions;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class OpenAccountSeparatedPomTest extends BaseSeleniumTest {
    @Test
    void shouldOpenSavingsAccountUsingSeparatedPom() {
        new LoginActions(driver)
                .open()
                .loginAs("john", "demo");

        new MenuActions(driver).openNewAccount();
        String newAccountId = new OpenAccountActions(driver).openSavingsAccount();

        Assertions.assertAll(
                () -> Assertions.assertFalse(newAccountId.isBlank()),
                () -> Assertions.assertTrue(newAccountId.matches("\\d+"))
        );
    }
}
