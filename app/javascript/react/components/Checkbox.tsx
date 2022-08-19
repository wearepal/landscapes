import * as React from 'react'
import { useState } from 'react'
import { uniqueId } from 'lodash'

export const Checkbox = ({ checked, indeterminate, change, children }) => {
  const [id] = useState(uniqueId('checkbox-'))
  return (
    <div className="custom-control custom-checkbox d-flex align-items-end">
      <input
        type="checkbox"
        className="custom-control-input"
        id={id}
        checked={checked}
        onChange={change}
        ref={r => { if (r) { r.indeterminate = indeterminate } }}
      />
      <label className="custom-control-label flex-grow-1" htmlFor={id}>
        {children}
      </label>
    </div>
  )
}
