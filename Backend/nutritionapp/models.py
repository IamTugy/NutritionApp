import datetime
import uuid

import pydantic


class NutritionItem(pydantic.BaseModel):
    """An item consumed by the user"""
    food_name: str = pydantic.Field(
        description="The name of the item", examples=["Apple", "Banana"]
    )
    calories: float = pydantic.Field(description="The number of calories in the item")
    protein: float = pydantic.Field(default=0.0, description="The number of protein in the item")
    fat: float = pydantic.Field(default=0.0, description="The number of fat in the item")
    carbohydrates: float = pydantic.Field(default=0.0, description="The number of carbohydrates in the item")
    fiber: float = pydantic.Field(default=0.0, description="The number of fiber in the item")


class NutritionSnapshot(pydantic.BaseModel):
    """A snapshot of the user's nutrition intake"""

    id: uuid.UUID = pydantic.Field(description="The unique identifier of the snapshot")
    user_id: uuid.UUID = pydantic.Field(description="The user's unique identifier")
    date: pydantic.AwareDatetime = pydantic.Field(
        description="The date and time the snapshot was taken"
    )
    total_calories: int = pydantic.Field(
        description="The total number of calories consumed in the snapshot"
    )

    items: list[NutritionItem] = pydantic.Field(
        description="The list of items consumed in the snapshot"
    )


class NutritionSnapshotCreate(pydantic.BaseModel):
    """Create a nutrition snapshot
    The calories consumed in the snapshot are calculated from the items with a 3rd party API
    """

    user_id: uuid.UUID | None = pydantic.Field(
        description="The user's unique identifier - allows creating snapshots for other users, after checking permissions"
    )
    items: list[str] = pydantic.Field(
        description="The list of items consumed in the snapshot"
    )


class Goals(pydantic.BaseModel):
    """Goals per user, each user has one singleton goal object"""

    id: uuid.UUID = pydantic.Field(description="The unique identifier of the goal")
    user_id: uuid.UUID = pydantic.Field(description="The user's unique identifier")
    updated_at: pydantic.AwareDatetime = pydantic.Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc),
        description="The date and time the goal was last updated",
    )
    total_calories: int | None = pydantic.Field(
        default=None, description="The total number of calories to consume in a day"
    )


class GoalsCreate(pydantic.BaseModel):
    """Create a goal for a user"""

    user_id: uuid.UUID | None = pydantic.Field(
        None,
        description="The user's unique identifier - allows changing other user's goals, after checking permissions",
    )
    total_calories: int | None = pydantic.Field(
        description="The total number of calories to consume in a day"
    )
