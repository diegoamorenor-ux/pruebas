package com.curso.selenium.tests;

import com.curso.selenium.waits.ExplicitWaitDemo;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class ExplicitWaitTest {
    @Test
    void shouldReturnConfirmationUsingExplicitWait() {
        ExplicitWaitDemo demo = new ExplicitWaitDemo();

        Assertions.assertEquals("Received!", demo.run("Selenium"));
    }
}