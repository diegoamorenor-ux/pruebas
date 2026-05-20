package com.curso.playwright;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;

public abstract class BasePlaywrightTest {
    private static Playwright playwright;
    private static Browser browser;

    protected BrowserContext context;
    protected Page page;

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();

        BrowserType.LaunchOptions options = new BrowserType.LaunchOptions()
                .setHeadless(!Boolean.getBoolean("headed"));

        String browserChannel = System.getProperty("browser.channel", "chrome");
        if (!browserChannel.isBlank()) {
            options.setChannel(browserChannel);
        }

        if (Boolean.getBoolean("slow")) {
            options.setSlowMo(250);
        }

        browser = playwright.chromium().launch(options);
    }

    @BeforeEach
    void createContext() {
        context = browser.newContext(new Browser.NewContextOptions().setViewportSize(1366, 768));
        page = context.newPage();
    }

    @AfterEach
    void closeContext() {
        if (context != null) {
            context.close();
        }
    }

    @AfterAll
    static void closeBrowser() {
        if (browser != null) {
            browser.close();
        }
        if (playwright != null) {
            playwright.close();
        }
    }
}
