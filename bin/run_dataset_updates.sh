#!/bin/bash

# Run the dataset update script using Rails runner
cd /app
bundle exec rails runner bin/update_dataset_units.rb 