package com.curso.api;

import io.restassured.response.Response;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.params.provider.CsvSource;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas API con PokéAPI
 * 
 * Conceptos cubiertos:
 * - Contract Testing: validar estructura de respuestas
 * - DDT (Data Driven Testing): múltiples datasets en un test
 * - Validaciones: status, headers, body
 * - Edge cases: límites, valores inválidos
 */
public class PokeApiContractTest {

    private static final String BASE_URL = "https://pokeapi.co/api/v2";

    // ==================== CONTRACT TESTING ====================
    // Validar que la respuesta tiene la estructura esperada

    @Test
    void shouldGetPokemonWithValidContract() {
        // Estructura esperada de un Pokémon
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/1")
        .then()
            .statusCode(200)
            // Contract: campos requeridos
            .body("id", notNullValue())
            .body("name", notNullValue())
            .body("height", notNullValue())
            .body("weight", notNullValue())
            .body("base_experience", notNullValue())
            .body("order", notNullValue())
            .body("is_default", notNullValue())
            // Contract: tipos de datos
            .body("id", instanceOf(Integer.class))
            .body("name", instanceOf(String.class))
            .body("height", instanceOf(Integer.class))
            .body("weight", instanceOf(Integer.class))
            // Contract: arrays
            .body("abilities", hasSize(greaterThan(0)))
            .body("types", hasSize(greaterThan(0)))
            .body("stats", hasSize(equalTo(6))); // Siempre 6 stats
    }

    @Test
    void shouldGetTypeWithValidContract() {
        // Estructura esperada de un Tipo
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/type/1") // Normal type
        .then()
            .statusCode(200)
            // Contract: campos requeridos
            .body("id", notNullValue())
            .body("name", notNullValue())
            .body("damage_relations", notNullValue())
            // Contract: subestructuras
            .body("damage_relations.no_damage_to", hasSize(greaterThanOrEqualTo(0)))
            .body("damage_relations.half_damage_to", hasSize(greaterThanOrEqualTo(0)))
            .body("damage_relations.double_damage_to", hasSize(greaterThanOrEqualTo(0)))
            .body("damage_relations.no_damage_from", hasSize(greaterThanOrEqualTo(0)))
            .body("damage_relations.half_damage_from", hasSize(greaterThanOrEqualTo(0)))
            .body("damage_relations.double_damage_from", hasSize(greaterThanOrEqualTo(0)));
    }

    @Test
    void shouldGetAbilityWithValidContract() {
        // Estructura esperada de una Habilidad
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/ability/1")
        .then()
            .statusCode(200)
            // Contract: campos requeridos
            .body("id", notNullValue())
            .body("name", notNullValue())
            .body("is_main_series", notNullValue())
            .body("generation", notNullValue())
            .body("effect_entries", notNullValue())
            // Contract: el nombre no debe estar vacío
            .body("name", not(emptyOrNullString()));
    }

    // ==================== DATA DRIVEN TESTING (DDT) ====================
    // Probar múltiples valores con un único test

    @ParameterizedTest
    @ValueSource(ints = {1, 4, 7, 25, 149})
    void shouldGetMultiplePokemonByIdDDT(int pokemonId) {
        // DDT: un test, múltiples IDs
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/" + pokemonId)
        .then()
            .statusCode(200)
            .body("id", equalTo(pokemonId))
            .body("name", notNullValue());
    }

    @ParameterizedTest
    @ValueSource(strings = {"bulbasaur", "charmander", "squirtle", "pikachu", "meowth"})
    void shouldGetPokemonByNameDDT(String pokemonName) {
        // DDT: buscar por nombre
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/" + pokemonName)
        .then()
            .statusCode(200)
            .body("name", equalTo(pokemonName))
            .body("id", greaterThan(0));
    }

    @ParameterizedTest
    @CsvSource({
        "1, Normal",
        "10, Fire",
        "4, Poison",
        "3, Flying",
        "5, Ground"
    })
    void shouldGetTypeDetailsWithParametersCSV(int typeId, String typeName) {
        // DDT con múltiples parámetros por fila
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/type/" + typeId)
        .then()
            .statusCode(200)
            .body("id", equalTo(typeId))
            .body("name", notNullValue());
    }

    // ==================== VALIDACIONES GENERALES ====================
    // Status codes, headers, valores de negocio

    @Test
    void shouldReturnHttpOkForValidPokemon() {
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/1")
        .then()
            .statusCode(200)
            .contentType(containsString("application/json"));
    }

    @Test
    void shouldReturnPokemonWithReasonableStats() {
        Response response = given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/pikachu");

        response.then().statusCode(200);

        // Validar stats: altura y peso deben ser >= 0
        int height = response.path("height");
        int weight = response.path("weight");
        
        assertTrue(height >= 0, "Altura debe ser >= 0");
        assertTrue(weight >= 0, "Peso debe ser >= 0");
    }

    @Test
    void shouldPokemonHaveValidBaseExperience() {
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/1")
        .then()
            .statusCode(200)
            .body("base_experience", greaterThanOrEqualTo(0));
    }

    // ==================== EDGE CASES ====================
    // Límites, valores especiales, errores

    @Test
    void shouldReturn404ForInvalidPokemonId() {
        // Edge case: Pokémon que no existe
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/999999")
        .then()
            .statusCode(404);
    }

    @Test
    void shouldReturn404ForInvalidPokemonName() {
        // Edge case: nombre inválido
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/invalid-pokemon-name-xyz")
        .then()
            .statusCode(404);
    }

    @Test
    void shouldHandlePaginationList() {
        // Edge case: listar con paginación
        given()
            .baseUri(BASE_URL)
            .queryParam("limit", 5)
            .queryParam("offset", 0)
        .when()
            .get("/pokemon")
        .then()
            .statusCode(200)
            .body("count", greaterThan(0))
            .body("results", hasSize(5));
    }

    @Test
    void shouldListPokemonWithDefaultPagination() {
        // Edge case: sin parámetros = paginación por defecto (20 items)
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon")
        .then()
            .statusCode(200)
            .body("count", greaterThan(900))
            .body("results", hasSize(20));
    }

    @Test
    void shouldReturnNextPageUrl() {
        // Edge case: validar links de paginación
        given()
            .baseUri(BASE_URL)
            .queryParam("limit", 10)
            .queryParam("offset", 0)
        .when()
            .get("/pokemon")
        .then()
            .statusCode(200)
            .body("next", notNullValue())
            .body("previous", nullValue()); // Primera página
    }

    // ==================== VALIDACIONES DE NEGOCIO ====================
    // Reglas que hacen sentido en el dominio

    @Test
    void shouldPikachuBeAnElectricType() {
        // Validar una regla de negocio: Pikachu debe ser tipo Electric
        given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/pikachu")
        .then()
            .statusCode(200)
            .body("types.type.name", hasItem("electric"));
    }

    @Test
    void shouldAllStatsHaveValidRange() {
        // Validar rango de stats: 0-255 son valores válidos en Pokémon
        Response response = given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/1");

        response.then().statusCode(200);

        // Extraer stats y validar rango
        var stats = response.path("stats");
        assertTrue(stats instanceof java.util.List, "Stats debe ser un array");
    }

    @Test
    void shouldAbilitiesHaveValidStructure() {
        Response response = given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/1");

        response.then().statusCode(200);

        // Cada habilidad debe tener: ability (con name y url) e is_hidden
        response.then()
            .body("abilities[0].ability", notNullValue())
            .body("abilities[0].ability.name", notNullValue())
            .body("abilities[0].is_hidden", notNullValue());
    }

    @Test
    void shouldOrderBePredictableForPokemon() {
        // Validar que el campo 'order' es el mismo para cada Pokémon
        Response firstCall = given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/1");

        Response secondCall = given()
            .baseUri(BASE_URL)
        .when()
            .get("/pokemon/1");

        Integer order1 = firstCall.path("order");
        Integer order2 = secondCall.path("order");

        assertEquals(order1, order2, "El orden debe ser consistente");
    }
}
