import * as React from 'react'

import { Tab } from "./project_editor"

interface ToolbarProps {
  backButtonPath: string
  projectName: string
  hasUnsavedChanges: boolean
  currentTab: Tab
  isProcessing: boolean
  isLoading: boolean
  setProjectName: (name: string) => void
  saveProject: () => void
  setCurrentTab: (tab: Tab) => void
  autoProcessing: boolean
  setAutoProcessing: (autoprocessing: boolean) => void
  manualProcessing: () => void
  setShowAP: () => void
  showAP: boolean
  setShowExtent: (boolean) => void
  zoomLevel: number
}
export const Toolbar = ({ backButtonPath, projectName, hasUnsavedChanges, currentTab, isProcessing, isLoading, setProjectName, saveProject, setCurrentTab, autoProcessing, setAutoProcessing, manualProcessing, setShowAP, showAP, setShowExtent, zoomLevel }: ToolbarProps) => (
  <div className="btn-toolbar p-2 bg-light border-top">
    <div className="btn-group mr-2">
      <a className="btn btn-sm btn-outline-primary" href={backButtonPath}>
        <i className="fas fa-angle-left mr-1" />
        Back to projects
      </a>
    </div>
    <div className="input-group mr-2">
      <input type="text" className="form-control form-control-sm" value={projectName} onChange={e => setProjectName(e.target.value)} />
    </div>
    <div className="btn-group mr-2">
      <button className="btn btn-sm btn-outline-primary" disabled={!hasUnsavedChanges} onClick={saveProject}>
        <i className="fas fa-save" /> Save
      </button>
    </div>    
    <div className="btn-group mr-2">
      <button className={`btn btn-sm btn-outline-primary`} onMouseEnter={() => setShowExtent(true)} onMouseLeave={() => setShowExtent(false)} onClick={() => console.log("WIP")}>
        <i className="fas fa-square" /> Extent
      </button>
      <div title={`Zoom level = ${zoomLevel}`} className="p-1 " style={{backgroundColor: zoomLevel > 20 ? "green" : (zoomLevel < 20 ? "orange" : "yellow"), fontSize: ".9em"}}>
        {zoomLevel > 20 ? "High" : (zoomLevel < 20 ? "Low" : "Med")}
      </div>
    </div>
    <div className="btn-group mr-2">
      <button className={`btn btn-sm ${currentTab == Tab.MapView ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setCurrentTab(Tab.MapView)}>
        <i className="fas fa-map-marked-alt" /> Map view
      </button>
      <button className={`btn btn-sm ${currentTab == Tab.ModelView ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setCurrentTab(Tab.ModelView)}>
        <i className="fas fa-project-diagram" /> Model view
      </button>
    </div>
    {
      currentTab == Tab.MapView  &&
    <div className="btn-group mr-2">
      <button className={`btn btn-sm ${showAP ? "btn-primary" : "btn-outline-primary"}`} onClick={setShowAP}>
        <i className="fas fa-object-group" /> Snapshot
      </button>
    </div>
    }
    <div className="btn-group mr-2">
      <button title='Toggle between automatic and manual processing. Manual processing is recommended for larger models.' className={`btn btn-sm ${autoProcessing ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setAutoProcessing(!autoProcessing)}>
        {autoProcessing ? <><i className="fas fa-toggle-on" /> Auto </> : <><i className="fas fa-toggle-off" /> Auto </>}
      </button>
      {
        !autoProcessing &&
        <button disabled={isProcessing} className={`btn btn-sm btn-primary`} onClick={manualProcessing}>
          <i className="fas fa-play" /> Run
        </button>
      }
    </div>
    {
      isProcessing &&
      <div className="d-flex align-items-center">
        <div><i className="fas fa-circle-notch fa-spin" /> Processing...</div>
      </div>
    }
    {
      isLoading &&
      <div className="d-flex align-items-center">
        <div><i className="fas fa-circle-notch fa-spin" /> Loading Dataset...</div>
      </div>
    }
  </div>
)
