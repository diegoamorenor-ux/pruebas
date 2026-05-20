package com.curso.playwright.api;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.RequestOptions;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas basicas de la API JsonPlaceholder con Playwright Java.
 * Demuestra GET y POST con APIRequestContext.
 */
class JsonPlaceholderApiTest {

    private static final Gson GSON = new Gson();

    @Test
    void shouldGetOnePostById() {
        try (Playwright playwright = Playwright.create()) {
            APIRequestContext request = playwright.request().newContext(
                new APIRequest.NewContextOptions()
                    .setBaseURL("https://jsonplaceholder.typicode.com"));

            APIResponse response = request.get("/posts/1");

            assertEquals(200, response.status());

            JsonObject body = GSON.fromJson(response.text(), JsonObject.class);
            assertEquals(1, body.get("id").getAsInt(), "id debe ser 1");
            assertFalse(body.get("title").getAsString().isEmpty(), "title no debe estar vacio");

            request.dispose();
        }
    }

    @Test
    void shouldCreateOnePost() {
        try (Playwright playwright = Playwright.create()) {
            APIRequestContext request = playwright.request().newContext(
                new APIRequest.NewContextOptions()
                    .setBaseURL("https://jsonplaceholder.typicode.com"));

            APIResponse response = request.post("/posts",
                RequestOptions.create()
                    .setHeader("Content-Type", "application/json")
                    .setData("{\"title\":\"curso-api\",\"body\":\"sample body\",\"userId\":10}"));

            assertEquals(201, response.status());

            JsonObject body = GSON.fromJson(response.text(), JsonObject.class);
            assertEquals("curso-api", body.get("title").getAsString(), "title debe ser curso-api");
            assertEquals(10, body.get("userId").getAsInt(), "userId debe ser 10");

            request.dispose();
        }
    }
}
