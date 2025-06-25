# NutritionApp
To check the app, please opt in to https://nutrition.tugy.org !

## Tech Stack

Backend: (Python)
- FastAPI
- Pydantic
- MongoDB
- Poetry

Frontend:
- React
- D3.js

## Development

To develop the backend go to the backend directory in vscode and read its README.md file.

To develop the frontend go to the frontend directory in vscode and read its README.md file.

## current API:

NutritionApp API
- GET /users/{user_id}/nutritios - get all the user's nutrition
- POST /users/{user_id}/nutritios - create a new nutrition for the user
- GET /users/{user_id}/nutritios/{nutrition_id} - get a specific nutrition for the user
- DELETE /users/{user_id}/nutritios/{nutrition_id} - delete a specific nutrition for the user

Goals API
- GET /users/{user_id}/goals - get all the user's goals
- PUT /users/{user_id}/goals - update/create the user's goals
