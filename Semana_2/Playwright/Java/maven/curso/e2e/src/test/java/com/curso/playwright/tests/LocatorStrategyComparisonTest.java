package com.curso.playwright.tests;

import com.curso.playwright.BasePlaywrightTest;
import com.microsoft.playwright.Locator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class LocatorStrategyComparisonTest extends BasePlaywrightTest {
    @Test
    void shouldCompareSemanticAndTraditionalSelectors() {
        page.navigate("https://www.selenium.dev/selenium/web/web-form.html");

        Locator semanticInput = page.getByLabel("Text input");
        Locator cssInput = page.locator("#my-text-id");
        Locator xpathInput = page.locator("xpath=//input[@name='my-text']");

        semanticInput.fill("Playwright 2026");

        Assertions.assertEquals("Playwright 2026", cssInput.inputValue());
        Assertions.assertEquals("Playwright 2026", xpathInput.inputValue());
    }

    @Test
    void shouldUseTraditionalSelectorsWhenSemanticInfoIsMissing() {
        page.navigate("https://parabank.parasoft.com/parabank/index.htm");

        page.locator("input[name='username']").fill("john");
        page.locator("input[name='password']").fill("demo");
        page.locator("xpath=//input[@value='Log In']").click();

        Locator accountTable = page.locator("#accountTable");
        accountTable.waitFor();
        Assertions.assertTrue(page.url().contains("overview.htm"));
        Assertions.assertTrue(accountTable.isVisible());
    }
}
