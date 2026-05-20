package com.curso.selenium.evidence;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

public final class EvidenceSupport {
    private static final String RUN_STARTED_AT = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
    private static final AtomicInteger STEP_COUNTER = new AtomicInteger(0);
    private static final Path ROOT = Path.of("evidencias", "selenium-clean", RUN_STARTED_AT);

    private EvidenceSupport() {
    }

    public static void capture(WebDriver driver, String stepName) {
        if (!(driver instanceof TakesScreenshot screenshotDriver)) {
            return;
        }

        try {
            Files.createDirectories(ROOT);
            int step = STEP_COUNTER.incrementAndGet();
            String fileName = String.format("%03d_%s.png", step, sanitize(stepName));
            Path destination = ROOT.resolve(fileName);
            Path source = screenshotDriver.getScreenshotAs(OutputType.FILE).toPath();
            Files.copy(source, destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo guardar evidencia: " + stepName, e);
        }
    }

    private static String sanitize(String raw) {
        return raw.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
    }
}
