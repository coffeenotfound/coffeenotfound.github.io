#!/bin/bash

jekyll build JEKYLL_ENV=production
gzip < "_site/search_data.json" > "_site/search_data.json.gz" &&
sleep 1s