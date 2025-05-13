from flask import Blueprint, request, jsonify

# Create a Blueprint so it can be added to the app later cleanly
health_api = Blueprint('health_api', __name__)

@health_api.route('/api/calculate/bmi', methods=['POST'])
def calculate_bmi():
    """
    Calculates BMI based on weight (kg) and height (cm).
    Request JSON:
    {
        "weight": 70,
        "height": 170
    }
    Returns:
    {
        "bmi": 24.2,
        "category": "Normal weight"
    }
    """
    data = request.get_json()
    weight = data.get("weight")
    height = data.get("height")

    if not weight or not height:
        return jsonify({"error": "Missing weight or height"}), 400

    height_m = height / 100  # convert cm to meters
    bmi = weight / (height_m ** 2)

    # BMI category
    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal weight"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obesity"

    return jsonify({
        "bmi": round(bmi, 1),
        "category": category
    })


@health_api.route('/api/calculate/tdee', methods=['POST'])
def calculate_tdee():
    """
    Calculates TDEE based on user parameters.
    Request JSON:
    {
        "weight": 70,
        "height": 170,
        "age": 30,
        "gender": "female",  # or "male"
        "activity_level": "moderate"  # sedentary, light, moderate, active, very_active
    }
    Returns:
    {
        "bmr": 1420.0,
        "tdee": 2201.0
    }
    """
    data = request.get_json()
    weight = data.get("weight")
    height = data.get("height")
    age = data.get("age")
    gender = data.get("gender")
    activity_level = data.get("activity_level")

    if not all([weight, height, age, gender, activity_level]):
        return jsonify({"error": "Missing one or more parameters"}), 400

    # BMR calculation using Mifflin-St Jeor Equation
    if gender == "male":
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    elif gender == "female":
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:
        return jsonify({"error": "Invalid gender"}), 400

    # Activity factor mapping
    activity_factors = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }

    factor = activity_factors.get(activity_level.lower())
    if not factor:
        return jsonify({"error": "Invalid activity level"}), 400

    tdee = bmr * factor

    return jsonify({
        "bmr": round(bmr, 1),
        "tdee": round(tdee, 1)
    })
