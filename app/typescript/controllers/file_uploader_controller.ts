import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["progress", "progressBar", "status", "submitButton"];
  declare readonly progressTarget: HTMLProgressElement;
  declare readonly progressBarTarget: HTMLProgressElement;
  declare readonly statusTarget: HTMLButtonElement;
  declare readonly submitButtonTarget: HTMLButtonElement;

  start(event: any): void {
    this.progressTarget.classList.remove("d-none");
    this.progressBarTarget.style.width = "0%";
    this.statusTarget.innerText = "";
    this.progressBarTarget.classList.add("progress-bar-animated");
    this.progressBarTarget.classList.remove("bg-danger");
  }

  progress(event: any): void {
    this.progressBarTarget.style.width = `${event.detail.progress}%`;
  }

  error(event: any): void {
    this.progressBarTarget.classList.remove("progress-bar-animated");
    this.progressBarTarget.classList.add("bg-danger");
    this.progressBarTarget.style.width = "100%";
    this.statusTarget.innerText = event.detail.error;
    this.submitButtonTarget.disabled = false;
    event.preventDefault();
  }
}
