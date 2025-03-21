// Load all the controllers within this directory and all subdirectories. 
// Controller files must be named *_controller.js.

import { Application } from "@hotwired/stimulus"
import DefaultTeamController from "./default_team_controller"
import * as Sentry from "@sentry/browser"

const application = Application.start()

if (process.env.NODE_ENV === "production") {
  const defaultErrorHandler = application.handleError
  application.handleError = (ex) => {
    Sentry.captureException(ex)
    defaultErrorHandler(ex)
  }
}

// Register controllers manually
application.register("default-team", DefaultTeamController)
