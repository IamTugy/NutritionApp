/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { GoalsCreateUserId } from './goalsCreateUserId'
import type { GoalsCreateTotalCalories } from './goalsCreateTotalCalories'
import type { GoalsCreateTotalProtein } from './goalsCreateTotalProtein'
import type { GoalsCreateTotalWaterIntake } from './goalsCreateTotalWaterIntake'

/**
 * Create a goal for a user
 */
export interface GoalsCreate {
  /** The user's unique identifier - allows changing other user's goals, after checking permissions */
  user_id?: GoalsCreateUserId
  /** The total number of calories to consume in a day */
  total_calories?: GoalsCreateTotalCalories
  /** The total number of protein to consume in a day in grams */
  total_protein?: GoalsCreateTotalProtein
  /** The total number of water to consume in a day in grams */
  total_water_intake?: GoalsCreateTotalWaterIntake
}
