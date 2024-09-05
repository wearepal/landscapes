import { Controller } from "stimulus"
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ProjectEditor } from '../projects/project_editor'
import { Project } from "../projects/state"
import { DBModels } from "../projects/db_models"

export default class extends Controller {
  static values = {
    projectId: Number,
    projectSource: Object,
    projectTeamId: Number,
    projectTeamName: String,
    projectDefraHedgerowPermission: Boolean,
    projectExtents: Object,
    backButtonPath: String,
    dbModels: Object
  }

  declare readonly projectIdValue: number
  declare readonly projectSourceValue: Project
  declare readonly projectTeamIdValue: number
  declare readonly projectTeamNameValue: string
  declare readonly projectDefraHedgerowPermissionValue: boolean
  declare readonly projectExtentsValue: any
  declare readonly backButtonPathValue: string
  declare readonly dbModelsValue: DBModels

  connect() {
    console.log('ProjectsController connected')
    console.log(this.projectIdValue)
    console.log(this.projectExtentsValue)
    ReactDOM.render(
      <ProjectEditor
        projectId={this.projectIdValue}
        projectSource={this.projectSourceValue}
        backButtonPath={this.backButtonPathValue}
        dbModels={this.dbModelsValue}
        teamId={this.projectTeamIdValue}
        teamName={this.projectTeamNameValue}
        permissions={
          { 
            DefraHedgerows: this.projectDefraHedgerowPermissionValue 
          }
        }
      />,
      this.element
    )
  }

  disconnect() {
    ReactDOM.unmountComponentAtNode(this.element)
  }
}
