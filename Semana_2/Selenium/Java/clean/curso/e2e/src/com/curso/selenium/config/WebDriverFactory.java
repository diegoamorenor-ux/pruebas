package com.curso.selenium.config;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public final class WebDriverFactory {
    private WebDriverFactory() {
    }

    public static WebDriver createChromeDriver() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--window-size=1366,768");

        if (!Boolean.getBoolean("headed")) {
            options.addArguments("--headless=new");
        }

        return new ChromeDriver(options);
    }
}
