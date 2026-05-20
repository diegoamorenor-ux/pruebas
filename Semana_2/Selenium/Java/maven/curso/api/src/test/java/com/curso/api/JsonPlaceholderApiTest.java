package com.curso.api;

import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;

class JsonPlaceholderApiTest {

  @Test
  void shouldGetOnePostById() {
    given()
        .baseUri("https://jsonplaceholder.typicode.com")
        .when()
        .get("/posts/1")
        .then()
        .statusCode(200)
        .body("id", equalTo(1))
        .body("title", notNullValue());
  }

  @Test
  void shouldCreateOnePost() {
    String payload = "{\"title\":\"curso-api\",\"body\":\"sample body\",\"userId\":10}";

    given()
        .baseUri("https://jsonplaceholder.typicode.com")
        .contentType("application/json")
        .body(payload)
        .when()
        .post("/posts")
        .then()
        .statusCode(201)
        .body("title", equalTo("curso-api"))
        .body("userId", equalTo(10));
  }
}
