import httpx
from pydantic import BaseModel

from .models import NutritionItem


# key for USDA API
API_KEY = "heBtgvSjYxv2xbeT9bDt0heAYWwAY6qrxXm3JFhx"
BASE_URL = "https://api.nal.usda.gov/fdc/v1"

NUTRITION_FIELD_TO_ID = {
    "calories": 1008,  # Energy
    "protein": 1003,  # Protein
    "fat": 1004,  # Total lipid (fat)
    "carbohydrates": 1005,  # Carbohydrate, by difference
    "fiber": 1079,  # Fiber, total dietary
    "water": 1051,  # Water
}


# Insert minimum required fields so that the model can be validated

class FoodNutrient(BaseModel):
    nutrientId: int
    nutrientName: str
    value: float

class FoodResult(BaseModel):
    fdcId: int
    description: str
    dataType: str  # "Survey (FNDDS)"
    foodCategory: str
    foodNutrients: list[FoodNutrient]


class SearchResult(BaseModel):
    totalHits: int
    currentPage: int
    totalPages: int
    pageList: list[int]

    foods: list[FoodResult]


async def _run_search(query: str) -> SearchResult:
    """Runs a search for a food by name."""
    params = {"query": query, "api_Key": API_KEY}
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/foods/search", params=params)

    return SearchResult.model_validate(response.json())


async def search_nutrition_items(query: str) -> list[NutritionItem]:
    """Searches for nutrition items by name."""
    search_result = await _run_search(query)

    if search_result.totalHits == 0 or len(search_result.foods) == 0:
        return []

    search_results = []
    for food_result in search_result.foods:
        if food_result.dataType != "Survey (FNDDS)":
            # Best results are from the FNDDS
            continue
        
        nutritions = {}
        for nutrition_field, nutrient_id in NUTRITION_FIELD_TO_ID.items():
            for nutrient in food_result.foodNutrients:
                if nutrient.nutrientId == nutrient_id:
                    nutritions[nutrition_field] = nutrient.value
                    break
        
        search_results.append(NutritionItem(
            food_name=food_result.description,
            calories=nutritions.get("calories", 0.0),
            protein=nutritions.get("protein", 0.0),
            fat=nutritions.get("fat", 0.0),
            carbohydrates=nutritions.get("carbohydrates", 0.0),
            fiber=nutritions.get("fiber", 0.0),
            water=nutritions.get("water", 0.0),
        ))

    return search_results


async def search_nutrition_item(query: str) -> NutritionItem | None:
    """Fetches food data from the USDA API based on the search query."""
    search_result = await _run_search(query)
    if search_result.totalHits == 0 or len(search_result.foods) == 0:
        return None

    food_result = search_result.foods[0] # fallback to first result
    for food_res in search_result.foods:
        if food_res.dataType != "Survey (FNDDS)":
            # Best results are from the FNDDS
            continue

        food_result = food_res
        break

    nutritions = {}

    for nutrition_field, nutrient_id in NUTRITION_FIELD_TO_ID.items():
        for nutrient in food_result.foodNutrients:
            if nutrient.nutrientId == nutrient_id:
                nutritions[nutrition_field] = nutrient.value
                break

    return NutritionItem(
        food_name=food_result.description,
        calories=nutritions.get("calories", 0.0),
        protein=nutritions.get("protein", 0.0),
        fat=nutritions.get("fat", 0.0),
        carbohydrates=nutritions.get("carbohydrates", 0.0),
        fiber=nutritions.get("fiber", 0.0),
        water=nutritions.get("water", 0.0),
    )
