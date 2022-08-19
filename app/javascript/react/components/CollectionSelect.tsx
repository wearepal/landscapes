import * as React from 'react'

export const CollectionSelect = ({ items, id, setId, placeholder }) => (
  <select
    className="custom-select"
    value={id === null ? '' : id}
    onChange={e => setId(e.target.value === "" ? null : parseInt(e.target.value))}
  >
    { placeholder && <option value="">{ placeholder }</option> }
    {
      items.map(i =>
        <option key={i.id} value={i.id}>{i.name}</option>
      )
    }
  </select>
)
