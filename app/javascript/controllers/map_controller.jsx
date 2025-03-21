import { Controller } from '@hotwired/stimulus'
import React, { useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { last } from 'lodash'
import { binary_to_base58, base58_to_binary } from 'base58-js'
import { encode, decode } from 'varint'

import { Checkbox, CollectionSelect, CollectionToggles, ImageLayer, Map, OSMLayer, OverlayLayer, Slider, TileLayer, ToggleAllCheckbox } from '../react/components'
import { fromLonLat } from 'ol/proj'

function toggle(array, value) {
  return array.includes(value) ? array.filter(v => v !== value) : [...array, value]
}

const convertExtent = (src) => fromLonLat([src[1], src[0]]).concat(fromLonLat([src[3], src[2]]))

const LabelToggles = ({ labelSchemaName, labels, visibleIds, toggleLabel, toggleAllLabels }) => <>
  <ToggleAllCheckbox
    collection={labels}
    toggledIds={visibleIds}
    toggleAll={toggleAllLabels}
    label={labelSchemaName}
  />
  <CollectionToggles
    items={labels}
    toggledIds={visibleIds}
    toggleId={toggleLabel}
  />
</>

const serialise = (state) => {
  let buffer = []
  const write = (value) => buffer.push(...encode(value))

  write(0)
  write(state.regionId)

  write((state.osmVisible && 1) | (state.imageryVisible && 2) | (state.labellingId && 4))
  write(state.mapTileLayerId)

  if (state.labellingId) {
    write(state.labellingId)
    write(state.labellingOpacity * 10)
    write(state.visibleLabels.length)
    state.visibleLabels.forEach(write)
  }

  write(state.visibleOverlays.length)
  state.visibleOverlays.forEach(write)
  if (state.visibleOverlays.length > 0) {
    write(state.overlayLineWidth)
    write(state.overlayOpacity * 10)
  }

  return binary_to_base58(buffer)
}

const deserialise = (string) => {
  try {
    let buffer = base58_to_binary(string)
    const read = () => {
      const result = decode(buffer)
      buffer = buffer.subarray(decode.bytes)
      return result
    }

    if (read() != 0) {
      throw 'Invalid version number'
    }

    const state = {}
    state.regionId = read()
    const flags = read()
    state.osmVisible = !!(flags & 1)
    state.imageryVisible = !!(flags & 2)
    state.mapTileLayerId = read()

    if (flags & 4) {
      state.labellingId = read()
      state.labellingOpacity = read() / 10
      state.visibleLabels = []
      const numVisibleLabels = read()
      for (let i = 0; i < numVisibleLabels; ++i) {
        state.visibleLabels.push(read())
      }
    }
    else {
      state.labellingId = null
      state.labellingOpacity = 0.4
      state.visibleLabels = []
    }

    state.visibleOverlays = []
    const numVisibleOverlays = read()
    for (let i = 0; i < numVisibleOverlays; ++i) {
      state.visibleOverlays.push(read())
    }
    state.overlayLineWidth = numVisibleOverlays > 0 ? read() : 2
    state.overlayOpacity = numVisibleOverlays > 0 ? read() / 10 : 0.1

    return state
  }
  catch {
    return null
  }
}

const MapView = ({ labels, labellingGroups, labellings, labelSchemas, mapTileLayers, overlays, regions }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_REGION_ID':
        return {
          ...state,
          regionId: action.value,
          labellingId: null,
          mapTileLayerId: last(mapTileLayers.filter(l => l.regionId === action.value))?.id,
          visibleOverlays: []
        }
      case 'SET_LABELLING_GROUP_ID':
        if (action.value === null) {
          return {
            ...state,
            labellingId: null,
            visibleLabels: []
          }
        }
        else {
          const oldLabelling = labellings.find(l => l.id === state.labellingId)
          const oldLabellingGroup = oldLabelling && labellingGroups.find(g => g.id === oldLabelling.labellingGroupId)
          const newLabellingGroup = labellingGroups.find(g => g.id === action.value)
          const labelSchemaChanged = oldLabellingGroup?.labelSchemaId !== newLabellingGroup.labelSchemaId
          const newLabelSchema = labelSchemas.find(s => s.id === newLabellingGroup.labelSchemaId)
          const newLabels = labels.filter(l => l.labelSchemaId === newLabellingGroup.labelSchemaId)
          const newLabelling = labellings.find(l => l.labellingGroupId === action.value)
          return {
            ...state,
            labellingId: newLabelling.id,
            mapTileLayerId: newLabelling.mapTileLayerId,
            visibleLabels: labelSchemaChanged ? newLabels.map(l => l.id) : state.visibleLabels
          }
        }
      case 'SET_LABELLING_ID':
        return {
          ...state,
          labellingId: action.value,
          mapTileLayerId: labellings.find(l => l.id === action.value).mapTileLayerId
        }
      case 'SET_MAP_TILE_LAYER_ID':
        return { ...state, mapTileLayerId: action.value, imageryVisible: true }
      case 'SET_LABELLING_OPACITY':
        return { ...state, labellingOpacity: action.value }
      case 'SET_OVERLAY_LINE_WIDTH':
        return { ...state, overlayLineWidth: action.value }
      case 'SET_OVERLAY_OPACITY':
        return { ...state, overlayOpacity: action.value }
      case 'TOGGLE_IMAGERY_VISIBILITY':
        return { ...state, imageryVisible: !state.imageryVisible }
      case 'TOGGLE_OSM_VISIBILITY':
        return { ...state, osmVisible: !state.osmVisible }
      case 'TOGGLE_LABEL_VISIBILITY':
        return { ...state, visibleLabels: toggle(state.visibleLabels, action.value) }
      case 'TOGGLE_ALL_LABELS_VISIBILITY':
        return {
          ...state,
          visibleLabels: state.visibleLabels.length === 0 ? labels.filter(l => l.labelSchemaId === labellingGroups.find(g => g.id === labellings.find(l => l.id === state.labellingId).labellingGroupId).labelSchemaId).map(l => l.id) : []
        }
      case 'TOGGLE_OVERLAY_VISIBILITY':
        return { ...state, visibleOverlays: toggle(state.visibleOverlays, action.value) }
      default:
        return state
    }
  }
  const initState = () => {
    return deserialise(window.location.hash.replace('#', '')) || {
      regionId: regions[0]?.id,
      mapTileLayerId: last(mapTileLayers.filter(l => l.regionId === regions[0]?.id))?.id,
      labellingId: null,
      imageryVisible: true,
      osmVisible: false,
      visibleLabels: [],
      visibleOverlays: [],
      labellingOpacity: 0.4,
      overlayLineWidth: 2,
      overlayOpacity: 0.1,
    }
  }
  const [state, dispatch] = useReducer(reducer, undefined, initState)
  const { regionId, mapTileLayerId, imageryVisible, osmVisible, labellingId, labellingOpacity, overlayLineWidth, overlayOpacity, visibleOverlays, visibleLabels } = state
  const labelling = labellings.find(l => l.id === labellingId)
  const labellingGroup = labelling ? labellingGroups.find(g => g.id === labelling.labellingGroupId) : null
  const region = regions.find(r => r.id === regionId)
  const extent = labellingId !== null ?
    convertExtent(labellingGroup.extent) :
    fromLonLat([...region.southWestExtent].reverse()).concat(
      fromLonLat([...region.northEastExtent].reverse())
    )
  
  useEffect(() => history.replaceState(undefined, undefined, `#${serialise(state)}`))
  return (
    <div className="d-flex align-items-stretch" style={{ height: "calc(100vh - 3.5rem)" }}>
      <div className="flex-grow-1 bg-dark" style={{ height: "100%" }}>
        <Map extent={extent}>
          <OSMLayer visible={osmVisible}/>
          <TileLayer
            mapTileLayer={mapTileLayers.find(l => l.id === mapTileLayerId)}
            visible={imageryVisible}
            opacity={osmVisible ? 0.6 : 1.0}
          />
          <ImageLayer
            visible={labellingId !== null}
            url={labellingId && `/labellings/${labellingId}.png?${
              visibleLabels.map(id => labels.find(l => l.id === id)).map(l => `labels[]=${l.index}`).join('&')
            }`}
            imageExtent={labellingGroup && convertExtent(labellingGroup.extent)}
            opacity={labellingOpacity}
          />
          {
            overlays.filter(o => o.regionId === regionId).map(o =>
              <OverlayLayer
                key={o.id}
                id={o.id}
                visible={visibleOverlays.includes(o.id)}
                colour={o.colour}
                backgroundOpacity={overlayOpacity}
                strokeWidth={overlayLineWidth}
              />
            )
          }
        </Map>
      </div>
      <div className="bg-light px-3 py-2" style={{ width: "350px", height: "100%", overflowY: "auto" }}>
        <div className="lead">Region</div>
        <CollectionSelect
          items={regions}
          id={regionId}
          setId={value => dispatch({ type: 'SET_REGION_ID', value })}
        />

        <hr/>

        <div className="lead">Base layers</div>
        
        <Checkbox checked={imageryVisible} change={() => dispatch({ type: 'TOGGLE_IMAGERY_VISIBILITY' })}>Imagery</Checkbox>
        
        <div className="ml-4 my-1">
          <CollectionSelect
            items={mapTileLayers.filter(l => l.regionId === regionId)}
            id={mapTileLayerId}
            setId={value => dispatch({ type: 'SET_MAP_TILE_LAYER_ID', value })}
          />
        </div>

        <Checkbox checked={osmVisible} change={() => dispatch({ type: 'TOGGLE_OSM_VISIBILITY' })}>OpenStreetMap</Checkbox>

        <hr/>

        <div className="lead">Labels</div>

        <div className="mb-2">
          <CollectionSelect
            items={labellingGroups.filter(g => g.regionId === regionId)}
            id={labellingGroup?.id}
            setId={value => dispatch({ type: 'SET_LABELLING_GROUP_ID', value })}
            placeholder="No labelling"
          />
        </div>

        {
          labellingId !== null &&
          <>
            <div className="mb-2">
              <CollectionSelect
                items={labellings.filter(l => l.labellingGroupId === labellingGroup.id).map(l => ({ id: l.id, name: mapTileLayers.find(m => m.id === l.mapTileLayerId).name }))}
                id={labellingId}
                setId={value => dispatch({ type: 'SET_LABELLING_ID', value })}
              />
            </div>

            <LabelToggles
              labelSchemaName={labelSchemas.find(s => s.id === labellingGroup.labelSchemaId).name}
              labels={labels.filter(l => l.labelSchemaId === labellingGroup.labelSchemaId)}
              visibleIds={visibleLabels}
              toggleLabel={value => dispatch({ type: 'TOGGLE_LABEL_VISIBILITY', value })}
              toggleAllLabels={() => dispatch({ type: 'TOGGLE_ALL_LABELS_VISIBILITY' })}
            />

            <Slider icon="fa-eye" min="0" max="1" step="0.1" value={labellingOpacity} setValue={value => dispatch({ type: 'SET_LABELLING_OPACITY', value })}/>
          </>
        }

        <hr/>

        <div className="lead">Overlays</div>

        <CollectionToggles
          items={overlays.filter(o => o.regionId === regionId)}
          toggledIds={visibleOverlays}
          toggleId={value => dispatch({ type: 'TOGGLE_OVERLAY_VISIBILITY', value })}
        />

        <Slider
          icon="fa-arrows-alt-h"
          min="1"
          max="10"
          value={overlayLineWidth}
          setValue={value => dispatch({ type: 'SET_OVERLAY_LINE_WIDTH', value })}
        />

        <Slider
          icon="fa-eye"
          min="0"
          max="1"
          step="0.1"
          value={overlayOpacity}
          setValue={value => dispatch({ type: 'SET_OVERLAY_OPACITY', value })}
        />
      </div>
    </div>
  )
}

export default class extends Controller {
  connect() {
    ReactDOM.render(
      <MapView {...JSON.parse(this.data.get("defs"))}/>,
      this.element
    )
  }

  disconnect() {
    ReactDOM.unmountComponentAtNode(this.element)
  }
}
