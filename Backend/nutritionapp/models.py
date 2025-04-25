import datetime
import uuid
from pydantic import BaseModel, Field


class NutritionItem(BaseModel):
    """An item consumed by the user"""

    food_name: str = Field(
        description="The name of the item", examples=["Apple", "Banana"]
    )
    calories: float = Field(description="The number of calories in the item")
    protein: float = Field(default=0.0, description="The number of protein in the item in grams")
    fat: float = Field(default=0.0, description="The number of fat in the item in grams")
    carbohydrates: float = Field(
        default=0.0, description="The number of carbohydrates in the item in grams"
    )
    fiber: float = Field(default=0.0, description="The number of fiber in the item in grams")
    water: float = Field(
        default=0.0, description="The number of water in the item in grams"
    )


class NutritionSnapshot(BaseModel):
    """A snapshot of the user's nutrition intake"""

    id: uuid.UUID = Field(description="The unique identifier of the snapshot")
    user_id: str = Field(description="The user's unique identifier")
    created_by: str | None = Field(
        default=None,
        description="The user's unique identifier who created the snapshot - allows creating snapshots for other users, after checking permissions",
    )
    date: datetime.datetime = Field(
        description="The date and time the snapshot was taken"
    )
    total_calories: int = Field(
        description="The total number of calories consumed in the snapshot"
    )

    items: list[NutritionItem] = Field(
        description="The list of items consumed in the snapshot"
    )


class NutritionSnapshotCreate(BaseModel):
    """Create a nutrition snapshot
    The calories consumed in the snapshot are calculated from the items with a 3rd party API
    """

    user_id: str | None = Field(
        description="The user's unique identifier - allows creating snapshots for other users, after checking permissions"
    )
    items: list[str] = Field(description="The list of items consumed in the snapshot")


class Goals(BaseModel):
    """Goals per user, each user has one singleton goal object"""

    id: uuid.UUID = Field(description="The unique identifier of the goal")
    user_id: str = Field(description="The user's unique identifier")
    updated_by: str | None = Field(
        default=None,
        description="The user's unique identifier who updated the goal - allows updating goals for other users, after checking permissions",
    )
    updated_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc),
        description="The date and time the goal was last updated",
    )
    total_calories: int | None = Field(
        default=None, description="The total number of calories to consume in a day"
    )
    total_protein: int | None = Field(
        default=None, description="The total number of protein to consume in a day in grams"
    )
    total_water_intake: float | None = Field(
        default=None, description="The total number of water to consume in a day in grams"
    )


class GoalsCreate(BaseModel):
    """Create a goal for a user"""

    user_id: str | None = Field(
        None,
        description="The user's unique identifier - allows changing other user's goals, after checking permissions",
    )
    total_calories: int | None = Field(
        default=None, description="The total number of calories to consume in a day"
    )
    total_protein: int | None = Field(
        default=None, description="The total number of protein to consume in a day in grams"
    )
    total_water_intake: float | None = Field(
        default=None, description="The total number of water to consume in a day in grams"
    )


class TrainerUserRelationship(BaseModel):
    """Represents a relationship between a trainer and a user"""
    
    user_id: str = Field(description="The user's unique identifier")
    trainer_id: str = Field(description="The trainer's unique identifier")
    state: str = Field(
        default="pending",
        description="The state of the relationship",
        pattern="^(pending|active)$"
    )
    created_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc),
        description="When the relationship was created"
    )
    updated_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc),
        description="When the relationship was last updated"
    )


class TrainerUserRelationshipCreate(BaseModel):
    """Create a new trainer-user relationship"""
    
    user_id: str = Field(description="The user's unique identifier")
    trainer_id: str = Field(description="The trainer's unique identifier")
    state: str = Field(
        default="pending",
        description="The initial state of the relationship",
        pattern="^(pending|active)$"
    )
