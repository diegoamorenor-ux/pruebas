package com.curso.selenium.tests;

import com.curso.selenium.waits.ImplicitWaitDemo;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class ImplicitWaitTest {
    @Test
    void shouldReturnConfirmationUsingImplicitWait() {
        ImplicitWaitDemo demo = new ImplicitWaitDemo();

        Assertions.assertEquals("Received!", demo.run("Selenium"));
    }
}