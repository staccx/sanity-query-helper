# Sanity Query Helper
[![CircleCI](https://circleci.com/gh/staccx/sanityQueryHelper.svg?style=svg)](https://circleci.com/gh/staccx/sanityQueryHelper)
[![Coverage Status](https://coveralls.io/repos/github/staccx/sanityQueryHelper/badge.svg?branch=master)](https://coveralls.io/github/staccx/sanityQueryHelper?branch=master)
## Description
GROQ can be hard to grok. While GROQ is a really powerful tool, it can be a bit overkill for your most common Sanity operations. To make it easier to query sanity for your content, sanity-query-helper provides an API which might be easier to understand.

## Install

`yarn add sanity-query-helper`

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