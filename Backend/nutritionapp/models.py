import datetime
import uuid

import pydantic


class NutritionItem(pydantic.BaseModel):
    """An item consumed by the user"""

    name: str = pydantic.Field(
        description="The name of the item", examples=["Apple", "Banana"]
    )
    calories: int = pydantic.Field(description="The number of calories in the item")


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
