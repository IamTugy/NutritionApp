# Nutrition App Backend

A FastAPI-based backend for a nutrition tracking application that uses MongoDB for data storage and integrates with the USDA Food Database API.

## Prerequisites

- Python 3.12+ (as specified in pyproject.toml)
- Poetry (Python package manager)
- Docker and Docker Compose
- MongoDB (will be run in Docker)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd NutritionApp/Backend
```

2. Install Poetry if you haven't already:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

3. Install dependencies using Poetry:
```bash
poetry install
```

4. To load the environment in VS Code:
   - Click command + shift + p (mac) and type: "Python: Select Interpreter"
   - Select "Python 3.12.5 64-bit ('3.12.5': pyenv)"

## Running the Application

1. Start MongoDB using Docker Compose:
```bash
docker compose up -d
```

2. Run the FastAPI application using Poetry:
```bash
poetry run start
```

The application will be available at `http://localhost:8000`

## API Documentation

Once the application is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Nutrition Snapshots
- `GET /users/{user_id}/nutritions` - Get nutrition snapshots for a user
- `POST /user/{user_id}/nutritions` - Create a new nutrition snapshot
- `GET /users/{user_id}/nutritions/{nutrition_id}` - Get a specific nutrition snapshot
- `DELETE /user/{user_id}/nutritions/{nutrition_id}` - Delete a nutrition snapshot

### Goals
- `GET /user/{user_id}/goals` - Get user's nutrition goals
- `PUT /user/{user_id}/goals` - Update user's nutrition goals

### Food Search
- `GET /search` - Search for food items in the USDA database

## MongoDB

The application uses MongoDB running in Docker with the following configuration:
- Port: 27017
- Database: nutrition_db
- Authentication:
  - Username: root
  - Password: example

To connect to MongoDB directly:
```bash
docker exec nutrition_mongodb mongosh "mongodb://root:example@localhost:27017/nutrition_db?authSource=admin"
```

## Development

### Adding New Dependencies
```bash
poetry add <package-name>  # For production dependencies
poetry add --group dev <package-name>  # For development dependencies
```

### Running Tests
```bash
poetry run pytest
```

### Code Style
The project uses Black and isort for code formatting:
```bash
poetry run black .
poetry run isort .
```

## Troubleshooting

1. If MongoDB connection fails:
   - Check if MongoDB container is running: `docker ps`
   - Restart MongoDB: `docker compose restart mongodb`

2. If the application fails to start:
   - Check if all dependencies are installed: `poetry install`
   - Verify Poetry environment is set up correctly: `poetry env info`
   - Check if MongoDB is running and accessible

## License

MIT License
