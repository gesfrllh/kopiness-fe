import { adjustData, generateData, getOptions } from '@/pages/api/coffee/api'
import { CoffePayload, CoffeResponseOptions } from '@/types/coffee'
import { formatError } from '@/utils/formatError'
import { create } from 'zustand'
import { SelectOptions } from '@/types'

type SelectedKey =
  | 'selected'
  | 'selectedStrength'
  | 'selectedNames'
  | 'selectedType'
  | 'selectedMilk'
  | 'selectedSyrup'

interface CoffeeAdjustment {
  analysis: string
  adjustment: string[]
  newRatio?: string
  newGrindSuggestion?: string
}

interface CoffeDataSuggestion {
  confidence: number,
  grindSize: string,
  milkAdjustment: string,
  newRatio: string,
  rootCause: string,
  temperature: string
}

interface CoffeeRecipe {
  title: string
  description: string
  steps: {
    step: string
    detail: string
  }[]
  ratio?: number
  waterTemp?: number
  milkTemp?: number
  milkVolume?: number,
  foamDensity?: string,
  grindSize: string
}

interface CoffeState {
  options: CoffeResponseOptions
  loading: boolean
  iced: boolean
  recipe: CoffeeRecipe | null
  adjustment: CoffeeAdjustment | null,
  dataAdjustAI: CoffeDataSuggestion | null,
  problem: string
  ratio: number,
  loadingGenerate: boolean,

  selected: SelectOptions
  selectedStrength: SelectOptions
  selectedNames: SelectOptions
  selectedType: SelectOptions
  selectedMilk: SelectOptions
  selectedSyrup: SelectOptions

  setSelectedField: (key: SelectedKey, value: SelectOptions) => void
  setIced: (value: boolean) => void
  setProblem: (value: string) => void

  getOptions: () => Promise<void>
  generateCoffe: () => Promise<void>
  adjustCoffee: () => Promise<void>
}

const emptyOption: SelectOptions = {
  label: '',
  value: ''
}

export const useCoffeeStore = create<CoffeState>((set, get) => ({
  options: {
    roastLevels: [],
    strength: [],
    drinkTypes: [],
    drinkNames: [],
    milkTypes: [],
    syrupTypes: []
  },
  ratio: 0,

  loading: false,
  loadingGenerate: false,
  iced: false,
  recipe: null,
  adjustment: null,
  problem: '',
  dataAdjustAI: null,

  selected: emptyOption,
  selectedStrength: emptyOption,
  selectedNames: emptyOption,
  selectedType: emptyOption,
  selectedMilk: emptyOption,
  selectedSyrup: emptyOption,

  setSelectedField: (key, value) =>
    set({ [key]: value } as Pick<CoffeState, typeof key>),

  setIced: (value) => set({ iced: value }),
  setProblem: (value) => set({ problem: value }),

  getOptions: async () => {
    set({ loading: true })

    try {
      const res = await getOptions()
      set({ options: res.data })
      set({ loading: false })
    } catch (err: unknown) {
      set({ loading: false })
      throw new Error(formatError(err) || 'Error get Coffee Options')
    } finally {
      set({ loading: false })
    }
  },
  adjustCoffee: async () => {
    set({ loadingGenerate: true })

    const state = get()

    try {
      const res = await adjustData({
        method: state.selectedNames.value,
        milkType: state.selectedMilk.value,
        ratio: state.ratio,
        ice: state.iced,
        drinkType: state.selectedType.value,
        syrupType: state.selectedSyrup.value,
        strength: state.selectedStrength.value,
        roastLevel: state.selected.value,
        tastePreference: state.selectedStrength.value,
        problem: state.problem
      })

      set({ loadingGenerate: false })
      set({
        adjustment: res.data.data,
        dataAdjustAI: res.data.data
      })
    } catch (err: unknown) {
      set({ loadingGenerate: false })
      throw new Error(formatError(err) || 'Error adjust Coffee')
    } finally {
      set({ loadingGenerate: false })
    }
  },

  generateCoffe: async () => {
    set({ loading: true })

    const state = get()

    const payload: CoffePayload = {
      drinkName: state.selectedNames.value,
      drinkType: state.selectedType.value,
      roastLevel: state.selected.value,
      strength: state.selectedStrength.value,
      milkType: state.selectedMilk.value,
      syrupType: state.selectedSyrup.value,
      ice: state.iced
    }

    try {
      const res = await generateData(payload)

      set({
        recipe: res.data,
        ratio: res.data.ratio,
      })

    } catch (err: unknown) {
      throw new Error(formatError(err) || 'Error generate Coffee')
    } finally {
      set({ loading: false })
    }
  }
}))
