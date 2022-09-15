// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import * as Sentry from "@sentry/browser"
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://947e82282a23489f91fd18ad21ffac44@o28290.ingest.sentry.io/5304857",
    environment: "production"
  })
}

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("bootstrap")

import TurbolinksAdapter from 'vue-turbolinks'
import Vue from 'vue'
Vue.use(TurbolinksAdapter)

import $ from "jquery"
import bsCustomFileInput from 'bs-custom-file-input'
document.addEventListener("turbolinks:load", () => bsCustomFileInput.init())
document.addEventListener("turbolinks:load", () => $("[title]").tooltip())

// Stop ImageStatic from resampling its image on load
import ImageStatic from "ol/source/ImageStatic"
delete ImageStatic.prototype.handleImageChange


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

import "../stylesheets/application"
import "controllers"

import proj4 from "proj4"
import { register } from "ol/proj/proj4"
proj4.defs(
  'EPSG:27700',
  '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
    '+x_0=400000 +y_0=-100000 +ellps=airy ' +
    '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
    '+units=m +no_defs'
)
register(proj4)
