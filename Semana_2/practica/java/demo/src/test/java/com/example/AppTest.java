package com.example;


import java.time.Duration;

import org.junit.platform.commons.annotation.Testable;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.junit.jupiter.api.Test;

/**
 * Unit test for simple App.
 */
public class AppTest 
{
    public WebDriver driver;

    
    /**
     * Rigorous Test :-)
     * @throws InterruptedException 
     */
    @Test
    public void AbrirGoogleConHttps() throws InterruptedException
    {
        driver = new ChromeDriver();
        driver.get("https://www.google.com/");

        Thread.sleep(10000);        
        driver.quit();
    }

    /**
     * Rigorous Test :-)
     */
    @Testable
    public void AbrirGoogleLimpia() throws InterruptedException
    {
        driver = new ChromeDriver();
        driver.get("www.google.com");
        Thread.sleep(2000);        

        driver.findElement(By.className("q")).sendKeys("Selenium");
    }
}
