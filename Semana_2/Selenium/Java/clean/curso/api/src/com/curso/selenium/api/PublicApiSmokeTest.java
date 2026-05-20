package com.curso.selenium.api;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class PublicApiSmokeTest {
    private static final HttpClient CLIENT = HttpClient.newHttpClient();

    @Test
    void shouldGetOnePostById() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://jsonplaceholder.typicode.com/posts/1"))
                .GET()
                .build();

        HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

        Assertions.assertEquals(200, response.statusCode());
        Assertions.assertTrue(response.body().contains("\"id\": 1"));
    }

    @Test
    void shouldCreateOnePost() throws IOException, InterruptedException {
        String payload = "{\"title\":\"curso-api\",\"body\":\"sample body\",\"userId\":10}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://jsonplaceholder.typicode.com/posts"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

        Assertions.assertEquals(201, response.statusCode());
        Assertions.assertTrue(response.body().contains("\"title\": \"curso-api\""));
    }
}
