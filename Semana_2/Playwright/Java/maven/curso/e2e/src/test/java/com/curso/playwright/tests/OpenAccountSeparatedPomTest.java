package com.curso.playwright.tests;

import com.curso.playwright.BasePlaywrightTest;
import com.curso.playwright.pages.separated.LoginActions;
import com.curso.playwright.pages.separated.MenuActions;
import com.curso.playwright.pages.separated.OpenAccountActions;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class OpenAccountSeparatedPomTest extends BasePlaywrightTest {
    @Test
    void shouldOpenSavingsAccountUsingSeparatedPom() {
        new LoginActions(page)
                .open()
                .loginAs("john", "demo");

        new MenuActions(page).openNewAccount();
        String newAccountId = new OpenAccountActions(page).openSavingsAccount();

        Assertions.assertAll(
                () -> Assertions.assertFalse(newAccountId.isBlank()),
                () -> Assertions.assertTrue(newAccountId.matches("\\d+"))
        );
    }
}
