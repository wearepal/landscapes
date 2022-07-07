"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
class HttpError extends Error {
}
class default_1 extends stimulus_1.Controller {
    connect() {
        this.numPendingPromises = 0;
    }
    disconnect() {
        delete this.numPendingPromises;
    }
    reclassify(event) {
        const label = this.labelTargets.find(target => target.checked);
        const formData = new FormData();
        formData.set("tile_index", event.target.dataset.tileIndex);
        formData.set("label_index", label.value);
        const originalColour = event.target.style.getPropertyValue("--label-colour");
        event.target.style.setProperty("--label-colour", label.dataset.colour);
        this.numPendingPromises++;
        this.navigationButtonTargets.forEach(target => target.disabled = true);
        this.fetchWithRetry(`/labellings/${this.data.get("labelling-id")}/labelling_corrections`, {
            method: "POST",
            headers: {
                "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
            },
            body: formData
        })
            .catch(error => {
            event.target.style.setProperty("--label-colour", originalColour);
            throw error;
        })
            .finally(() => {
            this.numPendingPromises--;
            if (this.numPendingPromises == 0) {
                this.navigationButtonTargets.forEach(target => target.disabled = false);
            }
        });
    }
    fetchWithRetry(input, init, retries = 10) {
        return fetch(input, init)
            .then(response => {
            if (!response.ok) {
                throw new HttpError(`HTTP ${response.status} ${response.statusText}`);
            }
        })
            .catch((error) => __awaiter(this, void 0, void 0, function* () {
            if (!(error instanceof HttpError) && retries > 0) {
                yield new Promise(r => setTimeout(r, 1000));
                return this.fetchWithRetry(input, init, retries - 1);
            }
            else {
                throw error;
            }
        }));
    }
}
exports.default = default_1;
default_1.targets = ["label", "navigationButton"];
