package com.curso.playwright.api;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.microsoft.playwright.*;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas de API con Playwright Java + PokeAPI
 *
 * Patrones demostrados:
 *   1. Contract Testing  - validar que la respuesta siempre tiene la misma estructura
 *   2. DDT              - ejecutar el mismo test con varios datasets
 *   3. Edge Cases       - recursos inexistentes, paginacion, valores limite
 *   4. Business Rules   - Pikachu es Electric, los Pokemon siempre tienen 6 stats
 */
public class PokeApiContractTest {

    private static final String BASE_URL = "https://pokeapi.co";
    private static final Gson GSON = new Gson();

    private static Playwright playwright;
    private static APIRequestContext request;

    @BeforeAll
    static void setup() {
        playwright = Playwright.create();
        request = playwright.request().newContext(
            new APIRequest.NewContextOptions().setBaseURL(BASE_URL)
        );
    }

    @AfterAll
    static void cleanup() {
        request.dispose();
        playwright.close();
    }

    /** Convierte el cuerpo de la respuesta a JsonObject con Gson. */
    private JsonObject body(APIResponse response) {
        return GSON.fromJson(response.text(), JsonObject.class);
    }

    // ================================================================ CONTRACT TESTING

    @Test
    void shouldGetPokemonWithValidContract() {
        APIResponse response = request.get("/api/v2/pokemon/1");
        assertEquals(200, response.status(), "HTTP 200 esperado");

        JsonObject pokemon = body(response);

        assertFalse(pokemon.get("id").isJsonNull(),              "id requerido");
        assertFalse(pokemon.get("name").isJsonNull(),            "name requerido");
        assertFalse(pokemon.get("height").isJsonNull(),          "height requerido");
        assertFalse(pokemon.get("weight").isJsonNull(),          "weight requerido");
        assertFalse(pokemon.get("base_experience").isJsonNull(), "base_experience requerido");

        assertTrue(pokemon.get("id").getAsInt() > 0,            "id debe ser positivo");
        assertFalse(pokemon.get("name").getAsString().isEmpty(), "name no puede estar vacio");

        JsonArray abilities = pokemon.getAsJsonArray("abilities");
        JsonArray types     = pokemon.getAsJsonArray("types");
        JsonArray stats     = pokemon.getAsJsonArray("stats");

        assertTrue(abilities.size() > 0, "Debe tener al menos una habilidad");
        assertTrue(types.size()     > 0, "Debe tener al menos un tipo");
        assertEquals(6, stats.size(),    "Siempre hay exactamente 6 stats");
    }

    @Test
    void shouldGetTypeWithValidContract() {
        APIResponse response = request.get("/api/v2/type/1");
        assertEquals(200, response.status());

        JsonObject type = body(response);

        assertFalse(type.get("id").isJsonNull(),  "id requerido");
        assertFalse(type.get("name").isJsonNull(), "name requerido");

        JsonObject dmg = type.getAsJsonObject("damage_relations");
        assertNotNull(dmg,                                        "damage_relations requerido");
        assertNotNull(dmg.getAsJsonArray("no_damage_to"),         "no_damage_to requerido");
        assertNotNull(dmg.getAsJsonArray("half_damage_to"),       "half_damage_to requerido");
        assertNotNull(dmg.getAsJsonArray("double_damage_to"),     "double_damage_to requerido");
        assertNotNull(dmg.getAsJsonArray("no_damage_from"),       "no_damage_from requerido");
        assertNotNull(dmg.getAsJsonArray("half_damage_from"),     "half_damage_from requerido");
        assertNotNull(dmg.getAsJsonArray("double_damage_from"),   "double_damage_from requerido");
    }

    @Test
    void shouldGetAbilityWithValidContract() {
        APIResponse response = request.get("/api/v2/ability/1");
        assertEquals(200, response.status());

        JsonObject ability = body(response);

        assertFalse(ability.get("id").isJsonNull(),              "id requerido");
        assertFalse(ability.get("name").isJsonNull(),            "name requerido");
        assertFalse(ability.get("is_main_series").isJsonNull(),  "is_main_series requerido");
        assertNotNull(ability.get("generation"),                 "generation requerido");
        assertNotNull(ability.getAsJsonArray("effect_entries"),  "effect_entries requerido");
        assertFalse(ability.get("name").getAsString().isEmpty(), "name no puede estar vacio");
    }

    // ================================================================ DDT - DATA DRIVEN TESTING

    @ParameterizedTest(name = "Pokemon ID {0} debe responder 200")
    @ValueSource(ints = {1, 4, 7, 25, 149})
    void shouldGetMultiplePokemonByIdDDT(int pokemonId) {
        APIResponse response = request.get("/api/v2/pokemon/" + pokemonId);
        assertEquals(200, response.status());

        JsonObject pokemon = body(response);
        assertEquals(pokemonId, pokemon.get("id").getAsInt(), "id debe coincidir");
        assertFalse(pokemon.get("name").getAsString().isEmpty(), "name no debe estar vacio");
    }

    @ParameterizedTest(name = "Pokemon ''{0}'' debe responder 200")
    @ValueSource(strings = {"bulbasaur", "charmander", "squirtle", "pikachu", "meowth"})
    void shouldGetPokemonByNameDDT(String pokemonName) {
        APIResponse response = request.get("/api/v2/pokemon/" + pokemonName);
        assertEquals(200, response.status());

        JsonObject pokemon = body(response);
        assertEquals(pokemonName, pokemon.get("name").getAsString(), "name debe coincidir");
        assertTrue(pokemon.get("id").getAsInt() > 0, "id debe ser positivo");
    }

    @ParameterizedTest(name = "Tipo {0} ({1}) debe existir")
    @CsvSource({
        "1, normal",
        "10, fire",
        "4, poison",
        "3, flying",
        "5, ground"
    })
    void shouldGetTypeDetailsWithParametersCSV(int typeId, String expectedName) {
        APIResponse response = request.get("/api/v2/type/" + typeId);
        assertEquals(200, response.status());

        JsonObject type = body(response);
        assertEquals(typeId,       type.get("id").getAsInt(),      "id debe coincidir");
        assertEquals(expectedName, type.get("name").getAsString(), "name debe coincidir");
    }

    // ================================================================ VALIDACIONES

    @Test
    void shouldReturnValidContentType() {
        APIResponse response = request.get("/api/v2/pokemon/1");
        assertEquals(200, response.status());

        String contentType = response.headers().get("content-type");
        assertNotNull(contentType, "Content-Type header requerido");
        assertTrue(contentType.contains("application/json"), "Debe ser JSON");
    }

    @Test
    void shouldReturnPokemonWithReasonableStats() {
        APIResponse response = request.get("/api/v2/pokemon/pikachu");
        assertEquals(200, response.status());

        JsonObject pokemon = body(response);
        int height = pokemon.get("height").getAsInt();
        int weight = pokemon.get("weight").getAsInt();

        assertTrue(height >= 0, "Altura no puede ser negativa");
        assertTrue(weight >= 0, "Peso no puede ser negativo");
    }

    @Test
    void shouldPokemonHaveValidBaseExperience() {
        APIResponse response = request.get("/api/v2/pokemon/1");
        assertEquals(200, response.status());

        JsonObject pokemon = body(response);
        JsonElement baseExp = pokemon.get("base_experience");

        if (!baseExp.isJsonNull()) {
            assertTrue(baseExp.getAsInt() >= 0, "base_experience debe ser >= 0");
        }
    }

    // ================================================================ EDGE CASES

    @Test
    void shouldReturn404ForInvalidPokemonId() {
        APIResponse response = request.get("/api/v2/pokemon/999999");
        assertEquals(404, response.status(), "ID inexistente debe retornar 404");
    }

    @Test
    void shouldReturn404ForInvalidPokemonName() {
        APIResponse response = request.get("/api/v2/pokemon/invalid-pokemon-xyz");
        assertEquals(404, response.status(), "Nombre inexistente debe retornar 404");
    }

    @Test
    void shouldHandlePaginationList() {
        APIResponse response = request.get("/api/v2/pokemon?limit=5&offset=0");
        assertEquals(200, response.status());

        JsonObject result  = body(response);
        JsonArray  results = result.getAsJsonArray("results");

        assertEquals(5, results.size(),                       "Debe retornar exactamente 5 items");
        assertTrue(result.get("count").getAsInt() > 0,        "count debe ser > 0");
    }

    @Test
    void shouldListPokemonWithDefaultPagination() {
        APIResponse response = request.get("/api/v2/pokemon");
        assertEquals(200, response.status());

        JsonObject result = body(response);
        assertEquals(20, result.getAsJsonArray("results").size(), "Por defecto son 20 items");
        assertTrue(result.get("count").getAsInt() > 900,          "Debe haber mas de 900 pokemon");
    }

    @Test
    void shouldReturnNextPageUrl() {
        APIResponse response = request.get("/api/v2/pokemon?limit=10&offset=0");
        assertEquals(200, response.status());

        JsonObject result = body(response);
        assertFalse(result.get("next").isJsonNull(),   "Primera pagina debe tener next");
        assertTrue(result.get("previous").isJsonNull(),"Primera pagina no tiene previous");
    }

    // ================================================================ REGLAS DE NEGOCIO

    @Test
    void shouldPikachuBeAnElectricType() {
        APIResponse response = request.get("/api/v2/pokemon/pikachu");
        assertEquals(200, response.status());

        JsonObject pokemon = body(response);
        JsonArray  types   = pokemon.getAsJsonArray("types");

        boolean isElectric = false;
        for (JsonElement t : types) {
            String typeName = t.getAsJsonObject()
                               .getAsJsonObject("type")
                               .get("name").getAsString();
            if ("electric".equals(typeName)) {
                isElectric = true;
                break;
            }
        }
        assertTrue(isElectric, "Pikachu debe ser de tipo electric");
    }

    @Test
    void shouldAllPokemonHaveSixStats() {
        for (int id : new int[]{1, 25, 149}) {
            APIResponse response = request.get("/api/v2/pokemon/" + id);
            assertEquals(200, response.status());
            JsonObject pokemon = body(response);
            assertEquals(6, pokemon.getAsJsonArray("stats").size(),
                "Pokemon " + id + " debe tener 6 stats");
        }
    }

    @Test
    void shouldAbilitiesHaveValidStructure() {
        APIResponse response = request.get("/api/v2/pokemon/1");
        assertEquals(200, response.status());

        JsonObject pokemon   = body(response);
        JsonArray  abilities = pokemon.getAsJsonArray("abilities");

        assertTrue(abilities.size() > 0, "Debe haber habilidades");

        JsonObject firstAbility  = abilities.get(0).getAsJsonObject();
        assertNotNull(firstAbility.get("ability"),  "ability no debe ser null");
        assertNotNull(firstAbility.get("is_hidden"), "is_hidden no debe ser null");

        JsonObject abilityDetail = firstAbility.getAsJsonObject("ability");
        assertFalse(abilityDetail.get("name").getAsString().isEmpty(),
            "ability.name no debe estar vacio");
    }

    @Test
    void shouldOrderBePredictableForPokemon() {
        JsonObject call1 = body(request.get("/api/v2/pokemon/1"));
        JsonObject call2 = body(request.get("/api/v2/pokemon/1"));

        assertEquals(call1.get("order").getAsInt(), call2.get("order").getAsInt(),
            "El orden debe ser consistente entre llamadas");
    }
}

