import datetime
import uuid

import pydantic
import uvicorn
from fastapi import FastAPI, Query

from .models import (Goals, GoalsCreate, NutritionItem, NutritionSnapshot,
                     NutritionSnapshotCreate)

app = FastAPI()


@app.get("/")
def read_root():
    return "Nutrition App"


@app.get("/users/{user_id}/nutritios", response_model=list[NutritionSnapshot])
async def get_nutrition(
    user_id: uuid.UUID,
    start_date: pydantic.AwareDatetime | None = Query(
        description="The start date of the range",
        example="2021-07-01T00:00:00Z",
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc)
        - datetime.timedelta(days=30),
    ),
    end_date: pydantic.AwareDatetime | None = Query(
        description="The end date of the range",
        example="2021-07-02T23:59:59Z",
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc),
    ),
):
    """Get nutrition snapshots for a user within a date range
    The default date range is the last 30 days.
    """

    # Mock data:
    return [
        NutritionSnapshot(
            id=uuid.uuid4(),
            user_id=user_id,
            date=start_date,
            total_calories=1000,
            items=[
                NutritionItem(name="Apple", calories=95),
                NutritionItem(name="Banana", calories=105),
            ],
        ),
        NutritionSnapshot(
            id=uuid.uuid4(),
            user_id=user_id,
            date=end_date,
            total_calories=1100,
            items=[
                NutritionItem(name="Apple", calories=95),
                NutritionItem(name="Banana", calories=105),
                NutritionItem(name="Orange", calories=80),
            ],
        ),
    ]


@app.post("/user/{user_id}/nutritions", response_model=NutritionSnapshot)
async def create_nutrition(user_id: uuid.UUID, snapshot: NutritionSnapshotCreate):
    """Create a nutrition snapshot"""

    # Mock data:
    return NutritionSnapshot(
        id=uuid.uuid4(),
        user_id=snapshot.user_id or user_id,
        date=datetime.datetime.now(datetime.timezone.utc),
        total_calories=len(snapshot.items) * 100,
        items=[NutritionItem(name=item, calories=100) for item in snapshot.items],
    )


@app.get("/users/{user_id}/nutritions/{nutrition_id}", response_model=NutritionSnapshot)
async def get_nutrition_by_id(user_id: uuid.UUID, nutrition_id: uuid.UUID):
    """Get a nutrition snapshot by ID"""

    # Mock data:
    return NutritionSnapshot(
        id=nutrition_id,
        user_id=user_id,
        date=datetime.datetime.now(datetime.timezone.utc),
        total_calories=1000,
        items=[
            NutritionItem(name="Apple", calories=95),
            NutritionItem(name="Banana", calories=105),
        ],
    )


@app.delete(
    "/user/{user_id}/nutritions/{nutrition_id}", response_model=NutritionSnapshot
)
async def delete_nutrition(user_id: uuid.UUID, nutrition_id: uuid.UUID):
    """Delete a nutrition snapshot"""

    # Mock data:
    return NutritionSnapshot(
        id=nutrition_id,
        user_id=user_id,
        date=datetime.datetime.now(datetime.timezone.utc),
        total_calories=1000,
        items=[
            NutritionItem(name="Apple", calories=95),
            NutritionItem(name="Banana", calories=105),
        ],
    )


@app.get("/user/{user_id}/goals", response_model=Goals)
async def get_goals(user_id: uuid.UUID):
    """Get the goals for a user"""

    # Mock data:
    return Goals(
        id=uuid.uuid4(),
        user_id=user_id,
        total_calories=2000,
    )


@app.put("/user/{user_id}/goals", response_model=Goals)
async def update_goals(user_id: uuid.UUID, goals: GoalsCreate):
    """Update the goals for a user"""

    # Mock data:
    return Goals(
        id=uuid.uuid4(),
        updated_at=datetime.datetime.now(datetime.timezone.utc),
        user_id=goals.user_id or user_id,
        total_calories=goals.total_calories,
    )


def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run("nutritionapp.main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    start()
