import * as React from 'react'
import { Checkbox, Swatch } from '.'

export const CollectionToggles = ({ items, toggledIds, toggleId }) => (
  items.map(i =>
    <Checkbox
      key={i.id}
      checked={toggledIds.includes(i.id)}
      change={() => toggleId(i.id)}
      indeterminate={false}
    >
      { i.colour && <Swatch colour={i.colour}/> } { i.label || i.name }
    </Checkbox>
  )
)
