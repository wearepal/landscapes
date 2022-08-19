import * as React from 'react'
import { Checkbox } from '.'

export const ToggleAllCheckbox = ({ collection, toggledIds, toggleAll, label }) => {
  const isToggled = i => toggledIds.includes(i.id)
  const allToggled = collection.every(isToggled)
  const someToggled = collection.some(isToggled)
  return (
    <Checkbox
      checked={allToggled}
      indeterminate={someToggled && !allToggled}
      change={toggleAll}
    >
      <strong>
        { label }
      </strong>
    </Checkbox>
  )
}
