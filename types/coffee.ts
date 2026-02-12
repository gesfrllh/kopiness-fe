import { SelectOptions } from "."

export interface CoffeResponseOptions {
  roastLevels: SelectOptions[],
  strength: SelectOptions[],
  drinkTypes: SelectOptions[],
  drinkNames: SelectOptions[],
  milkTypes: SelectOptions[],
  syrupTypes: SelectOptions[]
}

export interface CoffePayload {
  drinkType: string,
  drinkName: string,
  roastLevel: string,
  strength: string,
  milkType: string,
  syrupType: string,
  ice: boolean
}

export interface CoffeeRecipe {
  title: string
  description: string
  steps: {
    step: string
    detail: string
  }[]
  ratio?: number
  waterTemp?: number
  milkTemp?: number
}

export interface AdjustCoffePayload {
  method: string,
  roastLevel: string,
  tastePreference: string,
  problem: string,
  drinkType: string,
  milkType: string,
  syrupType: string,
  ice: boolean,
  ratio: number,
  strength: string,
}