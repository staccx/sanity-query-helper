# Sanity Query Helper
[![CircleCI](https://circleci.com/gh/staccx/sanityQueryHelper.svg?style=svg)](https://circleci.com/gh/staccx/sanityQueryHelper)
[![Coverage Status](https://coveralls.io/repos/github/staccx/sanityQueryHelper/badge.svg?branch=master)](https://coveralls.io/github/staccx/sanityQueryHelper?branch=master)
## Description


## Install

`yarn add sanityQueryHelper`

## Usage

Immutable. All functions are chainable (except for send) and return a new helper.
```
import SanityQueryHelper, {comparisons} from "sanityQueryHelper"

const sanityHelper = new SanityQueryHelper({sanityOptions: {projectId: "project-id", dataset: "myDataSet", useCdn: true})

// Create query

//Filters
const filter = sanityHelper
.ofType("post")
.withFilter("releaseDate") // .compare("releaseDate", comparisons.greaterOrEqualTo, 1979)
.greaterOrEqualTo(1979)
.send()
.then(useMyData) // 👈 response from sanity




//Picks aka Projections
filter
 .pick("title")
 .send()
 .then(useMyData) // 👈 response with projection

//Select
const select = projection
.select(0, 10)
.send()
.then(data => doStuff(data)) // 👈 response will have 10 first posts (if that many exists)

//Order by

select
.orderBy(releaseYear)
.send(orderedData => use(orderedData))
```