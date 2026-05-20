package com.curso.playwright.tests;

import com.curso.playwright.BasePlaywrightTest;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;
import com.microsoft.playwright.options.SelectOption;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class SemanticLocatorsTest extends BasePlaywrightTest {
    @Test
    void shouldUsePlaywrightRecommendedLocators() {
        page.navigate("https://www.selenium.dev/selenium/web/web-form.html");

        page.getByLabel("Text input").fill("Playwright");
        page.getByLabel("Password").fill("secret");
        page.getByLabel("Textarea").fill("Texto de practica");
        page.getByLabel("Dropdown (select)").selectOption(new SelectOption().setLabel("Two"));
        page.getByPlaceholder("Type to search...").fill("Seattle");

        page.getByRole(AriaRole.CHECKBOX, new Page.GetByRoleOptions().setName("Default checkbox")).check();
        page.getByRole(AriaRole.RADIO, new Page.GetByRoleOptions().setName("Default radio")).check();

        Assertions.assertEquals("Playwright", page.getByLabel("Text input").inputValue());
        Assertions.assertTrue(page.getByRole(AriaRole.CHECKBOX, new Page.GetByRoleOptions().setName("Default checkbox")).isChecked());

        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Submit")).click();

        Locator message = page.getByText("Received!");
        message.waitFor();
        Assertions.assertTrue(message.isVisible());
    }
}
