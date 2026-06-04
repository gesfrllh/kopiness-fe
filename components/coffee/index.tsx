'use client'

import React, { useEffect, useCallback, useRef } from 'react'
import Button from '../Base/Button'
import Select from '../Base/Select'
import Toggle from '../Base/Toggle'
import CTA from '../Base/cta'
import { useCoffeeStore } from '@/store/useCoffeStore'
import '../animation/AnimationCss.scss'
import Image from 'next/image'
import { AnimatedSection } from '../animation/AnimatedSection'
import AnimationLogin from '../animation/AnimationLogin'
import Tooltip from '../Base/ui/Tooltip'
import { Icon } from '@iconify/react/dist/iconify.js'

const Coffee = () => {
  const {
    options,
    iced,
    loading,
    getOptions,
    selected,
    selectedNames,
    selectedStrength,
    selectedSyrup,
    selectedMilk,
    selectedType,
    setSelectedField,
    generateCoffe,
    setIced,
    recipe,
    adjustCoffee,
    adjustment,
    problem,
    loadingGenerate,
    dataAdjustAI,
    setProblem
  } = useCoffeeStore()

  useEffect(() => {
    getOptions()
  }, [getOptions])

  const isMilkDrink = ['LATTE', 'CAPPUCCINO', 'MOCHA', 'FLAT_WHITE']
    .includes(selectedNames.value)

  const isBrew = selectedType.value === 'BREW'

  const handleSelectChange = useCallback(
    (
      list: typeof options.roastLevels,
      key:
        | 'selected'
        | 'selectedNames'
        | 'selectedType'
        | 'selectedMilk'
        | 'selectedStrength'
        | 'selectedSyrup'
    ) => (val: string) => {
      const selectedOption = list.find((opt) => opt.value === val)
      if (selectedOption) setSelectedField(key, selectedOption)
    },
    [setSelectedField]
  )

  const reciptRef = useRef<HTMLDivElement>(null)

  const handlePrintRecipe = () => {
    window.print()
  }
  const handleGenerate = () => {
    generateCoffe()
  }
  const showMilk =
    isMilkDrink && !isBrew

  const showSyrup =
    (isMilkDrink) && !isBrew

  return (
    <>
      <CTA
        title="Coffee Time"
        subtitle="Customize your brew with manual + AI adjustment"
        icon={<span className="text-2xl">☕</span>}
        rightSlot={
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white border border-white/10">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Ready
          </div>
        }
      />

      <div className="mt-6 mb-12 w-full rounded-2xl bg-colors-var p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 ">

          {/* LEFT PANEL */}
          <div className="lg:col-span-2 col-span-1 rounded-2xl bg-white p-8 shadow-sm border border-amber-100">

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-amber-900">
                  Manual Barista
                </h2>
                <p className="text-sm text-amber-700">
                  Customize your brew
                </p>
              </div>

              <Toggle
                label="Iced"
                labelPosition="right"
                variant="primary"
                checked={iced}
                onChange={setIced}
              />
            </div>

            <div className="flex flex-col gap-6">

              {/* REMINDER */}
              {!iced && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-3">
                  <span className="text-lg">☕</span>
                  <div>
                    Kamu belum mengaktifkan iced.
                    <div className="text-xs text-amber-700 mt-1">
                      Kopi akan dibuat panas.
                    </div>
                  </div>
                </div>
              )}
              <Select
                options={options.roastLevels}
                name="roast"
                required
                label="Roast"
                value={selected.value}
                onChange={handleSelectChange(options.roastLevels, 'selected')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  options={options.drinkNames}
                  name="menu"
                  required
                  label="Menu"
                  value={selectedNames.value}
                  onChange={handleSelectChange(options.drinkNames, 'selectedNames')}
                />

                <Select
                  options={options.drinkTypes}
                  required
                  name="type"
                  label="Type"
                  value={selectedType.value}
                  onChange={handleSelectChange(options.drinkTypes, 'selectedType')}
                />
              </div>
              <Select
                options={options.strength}
                name="strength"
                required
                label="Strength"
                value={selectedStrength.value}
                onChange={handleSelectChange(options.strength, 'selectedStrength')}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatedSection show={showMilk}>
                  <Select
                    options={options.milkTypes}
                    name="milk"
                    label="Milk Based"
                    value={selectedMilk.value}
                    onChange={handleSelectChange(options.milkTypes, 'selectedMilk')}
                  />
                </AnimatedSection>

                <AnimatedSection show={showSyrup}>
                  <Select
                    options={options.syrupTypes}
                    name="syrup"
                    label="Syrup"
                    value={selectedSyrup.value}
                    onChange={handleSelectChange(options.syrupTypes, 'selectedSyrup')}
                  />
                </AnimatedSection>
              </div>

            </div>

            <div className="pt-8 flex justify-end">
              <Button
                variant="outline"
                className="w-52 flex items-center justify-center gap-2"
                onClick={handleGenerate}
                disabled={loading || !selected.value || !selectedNames.value || !selectedType.value || !selectedStrength.value}
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? 'Brewing...' : 'Generate'}
              </Button>
            </div>
            {loadingGenerate && !dataAdjustAI && (
              <div className="mt-8 p-6 bg-colors-var border border-amber-800 rounded-2xl shadow-[4px_4px_0px_2px_#4E1F00]">
                <div className="h-6 w-52 bg-amber-100 rounded animate-pulse mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className={`flex flex-col gap-2 ${i === 6 ? 'col-span-2' : ''}`}
                    >
                      <div className="h-3 w-24 bg-amber-100 rounded animate-pulse" />
                      <div className="h-4 w-full bg-white rounded animate-pulse border border-amber-100" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <AnimatedSection show={!!dataAdjustAI}>
              <div className="mt-8 p-6 bg-colors-var border border-amber-800 rounded-2xl shadow-[4px_4px_0px_2px_#4E1F00]">
                <h4 className="font-bold text-amber-900 text-lg mb-4">AI Adjustment Preview</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-xs uppercase">Confidence</span>
                    <span className="font-semibold text-green-600">{dataAdjustAI?.confidence}%</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-bold text-xs uppercase">Grind Size</span>
                    <span className="font-semibold text-blue-600">{dataAdjustAI?.grindSize}</span>
                  </div>

                  <div className="flex flex-col ">
                    <span className="font-bold text-xs uppercase">New Ratio</span>
                    <span className="font-semibold text-purple-600">{dataAdjustAI?.newRatio}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-bold text-xs uppercase">Temperature</span>
                    <span className="font-semibold text-red-600">{dataAdjustAI?.temperature}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs uppercase">Milk Adjustment</span>
                    <span className="font-medium text-amber-700">{dataAdjustAI?.milkAdjustment ?? '-'}</span>
                  </div>
                  <div className="col-span-2 flex flex-col">
                    <span className="font-bold text-xs uppercase">Root Cause</span>
                    <span className="text-gray-700">{dataAdjustAI?.rootCause}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

          </div>
          {/* AI Adjustment Preview */}

          {/* RIGHT PANEL */}
          <div className="rounded-2xl bg-white p-8 border border-amber-100 shadow-sm h-full">

            {!loading && !recipe && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <div className="text-5xl mb-4">☕</div>
                <p className="text-sm font-medium">
                  No recipe yet
                </p>
                <p className="text-xs mt-1">
                  Fill the options and generate.
                </p>
              </div>
            )}

            {loading && (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-6 bg-amber-100 rounded w-2/3" />
                <div className="h-4 bg-amber-50 rounded w-full" />
                <div className="h-4 bg-amber-50 rounded w-5/6" />

                <div className="mt-6 flex flex-col gap-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-100" />
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="h-4 bg-amber-100 rounded w-1/3" />
                        <div className="h-3 bg-amber-50 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && recipe && (
              <div ref={reciptRef} className="recipe-print-area flex flex-col animate-fadeIn">

                <div className="border-b flex justify-between items-center border-amber-100 pb-5 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-amber-900">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-amber-700 mt-2">
                      {recipe.description}
                    </p>
                  </div>
                  <div>
                    <Image
                      src='https://tdlbsxwhiusuobvszxvg.supabase.co/storage/v1/object/public/s3/logo.svg'
                      alt="logo"
                      width={72}
                      height={72} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 text-xs">
                  {recipe.ratio && (
                    <span className="px-3 py-1 bg-amber-50 rounded-full text-amber-800">
                      Ratio {recipe.ratio}
                    </span>
                  )}
                  {recipe.waterTemp && (
                    <span className="px-3 py-1 bg-blue-50 rounded-full text-blue-800">
                      {recipe.waterTemp}°C
                    </span>
                  )}
                  {recipe.grindSize && (
                    <span className="px-3 py-1 bg-orange-50 rounded-full text-orange-800">
                      {recipe.grindSize}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-6 overflow-y-auto pr-2">
                  {recipe.steps.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 opacity-0 animate-slideUp"
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.step}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recipe && (
              <div>
                <div className="flex items-center justify-end gap-3 my-6">
                  <div className='cursor-pointer flex items-center gap-3' onClick={() => handlePrintRecipe()}>
                    <div className="text-xs text-amber-700  hover:underline font-medium" >
                      Ready to print
                    </div>
                    <div>
                      <Tooltip content="Print">
                        <Icon icon="ic:outline-local-printshop" width={28} style={{ color: '#b63232ff' }} />
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t pt-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Kopinya kurang enak?
                  </h4>

                  <Select
                    options={recipe.potentialProblems
                      .map((prob) => ({ label: prob.label, value: prob.key }))
                      .filter((opt, index, self) =>
                        self.findIndex((o) => o.value === opt.value) === index
                      )}
                    name="problem"
                    label="Problem"
                    value={problem}
                    onChange={(val) => setProblem(val)}
                  />

                  <Button
                    variant="solid"
                    className="w-44 flex items-center mt-4 justify-center gap-2"
                    onClick={adjustCoffee}
                    disabled={loadingGenerate}
                  >
                    {loadingGenerate && (
                      <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {loadingGenerate ? 'Adjust Brew...' : 'Adjustment'}
                  </Button>
                </div>
              </div>
            )}

            {/* Adjustment Skeleton */}
            {loadingGenerate && !adjustment && (
              <div className="mt-6 p-6 bg-colors-var border border-amber-800 rounded-2xl shadow-[4px_4px_0px_2px_#4E1F00]">
                <div className="h-6 w-56 bg-amber-100 rounded animate-pulse mb-6" />

                {/* analysis skeleton */}
                <div className="mb-5 p-4 bg-amber-100 rounded-lg border-l-4 border-amber-400">
                  <div className="h-3 w-5/6 bg-amber-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-4/6 bg-amber-200 rounded animate-pulse" />
                </div>

                {/* list skeleton */}
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm border border-amber-100"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-100 animate-pulse" />
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="h-3 w-5/6 bg-amber-50 rounded animate-pulse" />
                        <div className="h-3 w-4/6 bg-amber-50 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AnimatedSection show={!!adjustment && !loadingGenerate}>
              <div className="mt-6 p-6 bg-colors-var border border-amber-800 rounded-2xl shadow-[4px_4px_0px_2px_#4E1F00]">
                <h4 className="font-bold text-amber-900 text-lg mb-4">
                  Adjustment Suggestion
                </h4>

                {/* Analysis */}
                <div className="mb-4 p-4 bg-amber-100 rounded-lg border-l-4 border-amber-400 text-sm text-amber-900">
                  {adjustment?.analysis}
                </div>

                {/* Steps / Adjustments */}
                <div className="flex flex-col gap-3">
                  {adjustment?.adjustment.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm border border-amber-100 hover:bg-amber-50 transition"
                    >
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-400 text-white font-semibold text-xs mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </div>
      {loading ? <AnimationLogin /> : ''}
    </>
  )
}

export default Coffee
