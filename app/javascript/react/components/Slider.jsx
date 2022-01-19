import React from 'react'

export const Slider = ({ icon, min, max, step, value, setValue }) => (
  <div className="d-flex align-items-center mt-2">
    <i className={`fas ${icon}`}></i>
    <input
      type="range"
      className="custom-range ml-2"
      min={min}
      max={max}
      value={value}
      step={step}
      onChange={e => setValue(Number(e.target.value))}
    />
  </div>
)
