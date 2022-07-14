import { Controller } from "stimulus"
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ProjectEditor } from '../projects/project_editor'
import { Project } from "../projects/project"

export default class extends Controller {
  static values = {
    projectSource: Object,
    backButtonPath: String,
  }

  declare readonly projectSourceValue: Project
  declare readonly backButtonPathValue: string

  connect() {
    console.log(this.projectSourceValue)
    ReactDOM.render(
      <ProjectEditor projectSource={this.projectSourceValue} backButtonPath={this.backButtonPathValue}/>,
      this.element
    )
  }

  disconnect() {
    ReactDOM.unmountComponentAtNode(this.element)
  }
}
