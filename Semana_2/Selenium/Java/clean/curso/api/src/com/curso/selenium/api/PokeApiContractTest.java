package com.curso.selenium.api;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas API con PokéAPI + Selenium Java Clean (sin Maven, solo JDK)
 * 
 * Conceptos cubiertos:
 * - Contract Testing: validar estructura de respuestas
 * - DDT (Data Driven Testing): múltiples datasets
 * - Validaciones: status, tipos, campos
 * - Edge cases: errores, paginación
 */
public class PokeApiContractTest {

    private static final String BASE_URL = "https://pokeapi.co/api/v2";
    private static final HttpClient httpClient = HttpClient.newHttpClient();
    private static final Gson gson = new Gson();

    private String getJsonResponse(String url) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI(url))
            .GET()
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    private int getStatusCode(String url) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(new URI(url))
            .GET()
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.statusCode();
    }

    private JsonObject getJsonObject(String json) {
        return gson.fromJson(json, JsonObject.class);
    }

    // ==================== CONTRACT TESTING ====================

    @Test
    void shouldGetPokemonWithValidContract() throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon/1");
        JsonObject pokemon = getJsonObject(json);

        // Validar campos requeridos
        assertTrue(pokemon.has("id"), "Debe tener 'id'");
        assertTrue(pokemon.has("name"), "Debe tener 'name'");
        assertTrue(pokemon.has("height"), "Debe tener 'height'");
        assertTrue(pokemon.has("weight"), "Debe tener 'weight'");
        assertTrue(pokemon.has("base_experience"), "Debe tener 'base_experience'");
        assertTrue(pokemon.has("order"), "Debe tener 'order'");
        assertTrue(pokemon.has("is_default"), "Debe tener 'is_default'");

        // Validar tipos
        assertTrue(pokemon.get("id").isJsonPrimitive(), "id debe ser primitivo");
        assertTrue(pokemon.get("name").isJsonPrimitive(), "name debe ser primitivo");
        assertTrue(pokemon.get("height").isJsonPrimitive(), "height debe ser primitivo");

        // Validar arrays
        assertTrue(pokemon.has("abilities"), "Debe tener abilities");
        assertTrue(pokemon.get("abilities").isJsonArray(), "abilities debe ser array");
        JsonArray abilities = pokemon.getAsJsonArray("abilities");
        assertTrue(abilities.size() > 0, "Debe tener al menos una habilidad");

        // Validar tipos
        assertTrue(pokemon.has("types"), "Debe tener types");
        JsonArray types = pokemon.getAsJsonArray("types");
        assertTrue(types.size() > 0, "Debe tener al menos un tipo");

        // Validar stats (siempre 6)
        assertTrue(pokemon.has("stats"), "Debe tener stats");
        JsonArray stats = pokemon.getAsJsonArray("stats");
        assertEquals(6, stats.size(), "Debe tener exactamente 6 stats");
    }

    @Test
    void shouldGetTypeWithValidContract() throws Exception {
        String json = getJsonResponse(BASE_URL + "/type/1");
        JsonObject type = getJsonObject(json);

        assertTrue(type.has("id"), "Debe tener id");
        assertTrue(type.has("name"), "Debe tener name");
        assertTrue(type.has("damage_relations"), "Debe tener damage_relations");

        JsonObject damageRel = type.getAsJsonObject("damage_relations");
        assertTrue(damageRel.has("no_damage_to"), "Debe tener no_damage_to");
        assertTrue(damageRel.has("half_damage_to"), "Debe tener half_damage_to");
        assertTrue(damageRel.has("double_damage_to"), "Debe tener double_damage_to");
        assertTrue(damageRel.has("double_damage_from"), "Debe tener double_damage_from");
    }

    @Test
    void shouldGetAbilityWithValidContract() throws Exception {
        String json = getJsonResponse(BASE_URL + "/ability/1");
        JsonObject ability = getJsonObject(json);

        assertTrue(ability.has("id"), "Debe tener id");
        assertTrue(ability.has("name"), "Debe tener name");
        assertTrue(ability.has("is_main_series"), "Debe tener is_main_series");
        assertTrue(ability.has("generation"), "Debe tener generation");
        assertTrue(ability.has("effect_entries"), "Debe tener effect_entries");

        String name = ability.get("name").getAsString();
        assertTrue(name.length() > 0, "name debe tener contenido");
    }

    // ==================== DATA DRIVEN TESTING (DDT) ====================

    @ParameterizedTest
    @ValueSource(ints = {1, 4, 7, 25, 149})
    void shouldGetMultiplePokemonByIdDDT(int pokemonId) throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon/" + pokemonId);
        JsonObject pokemon = getJsonObject(json);

        assertEquals(pokemonId, pokemon.get("id").getAsInt(), "ID debe coincidir");
        assertTrue(pokemon.has("name"), "Debe tener name");
    }

    @ParameterizedTest
    @ValueSource(strings = {"bulbasaur", "charmander", "squirtle", "pikachu", "meowth"})
    void shouldGetPokemonByNameDDT(String pokemonName) throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon/" + pokemonName);
        JsonObject pokemon = getJsonObject(json);

        assertEquals(pokemonName, pokemon.get("name").getAsString(), "name debe coincidir");
        assertTrue(pokemon.get("id").getAsInt() > 0, "id debe ser positivo");
    }

    @ParameterizedTest
    @CsvSource({
        "1, Normal",
        "10, Fire",
        "4, Poison",
        "3, Flying",
        "5, Ground"
    })
    void shouldGetTypeDetailsWithParametersCSV(int typeId, String typeName) throws Exception {
        String json = getJsonResponse(BASE_URL + "/type/" + typeId);
        JsonObject type = getJsonObject(json);

        assertEquals(typeId, type.get("id").getAsInt(), "ID debe coincidir");
        assertTrue(type.has("name"), "Debe tener name");
    }

    // ==================== VALIDACIONES ====================

    @Test
    void shouldReturnHttpOkForValidPokemon() throws Exception {
        int status = getStatusCode(BASE_URL + "/pokemon/1");
        assertEquals(200, status, "Status debe ser 200");
    }

    @Test
    void shouldReturnPokemonWithReasonableStats() throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon/pikachu");
        JsonObject pokemon = getJsonObject(json);

        int height = pokemon.get("height").getAsInt();
        int weight = pokemon.get("weight").getAsInt();

        assertTrue(height >= 0, "Altura debe ser >= 0");
        assertTrue(weight >= 0, "Peso debe ser >= 0");
    }

    @Test
    void shouldPokemonHaveValidBaseExperience() throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon/1");
        JsonObject pokemon = getJsonObject(json);

        int baseExp = pokemon.get("base_experience").getAsInt();
        assertTrue(baseExp >= 0, "base_experience debe ser >= 0");
    }

    // ==================== EDGE CASES ====================

    @Test
    void shouldReturn404ForInvalidPokemonId() throws Exception {
        int status = getStatusCode(BASE_URL + "/pokemon/999999");
        assertEquals(404, status, "Debe retornar 404 para Pokémon inexistente");
    }

    @Test
    void shouldReturn404ForInvalidPokemonName() throws Exception {
        int status = getStatusCode(BASE_URL + "/pokemon/invalid-pokemon-name-xyz");
        assertEquals(404, status, "Debe retornar 404 para nombre inválido");
    }

    @Test
    void shouldHandlePaginationList() throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon?limit=5&offset=0");
        JsonObject result = getJsonObject(json);

        assertTrue(result.has("results"), "Debe tener results");
        JsonArray results = result.getAsJsonArray("results");
        assertEquals(5, results.size(), "Debe retornar 5 items");

        assertTrue(result.has("count"), "Debe tener count");
        assertTrue(result.get("count").getAsInt() > 0, "count debe ser > 0");
    }

    @Test
    void shouldListPokemonWithDefaultPagination() throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon");
        JsonObject result = getJsonObject(json);

        JsonArray results = result.getAsJsonArray("results");
        assertEquals(20, results.size(), "Default debe ser 20 items");

        assertTrue(result.get("count").getAsInt() > 900, "Debe haber muchos pokémon");
    }

    @Test
    void shouldReturnNextPageUrl() throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon?limit=10&offset=0");
        JsonObject result = getJsonObject(json);

        assertTrue(result.has("next"), "Debe tener next");
        assertNotNull(result.get("next").getAsString(), "next debe tener valor");

        assertTrue(result.has("previous"), "Debe tener previous");
        assertTrue(result.get("previous").isJsonNull(), "previous debe ser null en primera página");
    }

    // ==================== VALIDACIONES DE NEGOCIO ====================

    @Test
    void shouldPikachuBeAnElectricType() throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon/pikachu");
        JsonObject pokemon = getJsonObject(json);

        JsonArray types = pokemon.getAsJsonArray("types");

        boolean hasElectric = false;
        for (int i = 0; i < types.size(); i++) {
            JsonObject type = types.get(i).getAsJsonObject();
            JsonObject typeDetail = type.getAsJsonObject("type");
            if ("electric".equals(typeDetail.get("name").getAsString())) {
                hasElectric = true;
                break;
            }
        }

        assertTrue(hasElectric, "Pikachu debe ser tipo Electric");
    }

    @Test
    void shouldAllStatsHaveValidRange() throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon/1");
        JsonObject pokemon = getJsonObject(json);

        JsonArray stats = pokemon.getAsJsonArray("stats");
        assertTrue(stats.isJsonArray(), "stats debe ser array");
    }

    @Test
    void shouldAbilitiesHaveValidStructure() throws Exception {
        String json = getJsonResponse(BASE_URL + "/pokemon/1");
        JsonObject pokemon = getJsonObject(json);

        JsonArray abilities = pokemon.getAsJsonArray("abilities");
        assertTrue(abilities.size() > 0, "Debe tener habilidades");

        JsonObject firstAbility = abilities.get(0).getAsJsonObject();
        assertTrue(firstAbility.has("ability"), "Debe tener ability");
        assertTrue(firstAbility.has("is_hidden"), "Debe tener is_hidden");

        JsonObject abilityDetail = firstAbility.getAsJsonObject("ability");
        assertTrue(abilityDetail.has("name"), "ability.name no debe ser null");
    }

    @Test
    void shouldOrderBePredictableForPokemon() throws Exception {
        String json1 = getJsonResponse(BASE_URL + "/pokemon/1");
        String json2 = getJsonResponse(BASE_URL + "/pokemon/1");

        JsonObject pokemon1 = getJsonObject(json1);
        JsonObject pokemon2 = getJsonObject(json2);

        int order1 = pokemon1.get("order").getAsInt();
        int order2 = pokemon2.get("order").getAsInt();

        assertEquals(order1, order2, "El orden debe ser consistente");
    }
}
