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
    backButtonPath: String,
    dbModels: Object,
  }

  declare readonly projectIdValue: number
  declare readonly projectSourceValue: Project
  declare readonly projectTeamIdValue: number
  declare readonly projectTeamNameValue: string
  declare readonly backButtonPathValue: string
  declare readonly dbModelsValue: DBModels


  connect() {
    ReactDOM.render(
      <ProjectEditor
        projectId={this.projectIdValue}
        projectSource={this.projectSourceValue}
        backButtonPath={this.backButtonPathValue}
        dbModels={this.dbModelsValue}
        teamId={this.projectTeamIdValue}
        teamName={this.projectTeamNameValue}
      />,
      this.element
    )
  }

  disconnect() {
    ReactDOM.unmountComponentAtNode(this.element)
  }
}
