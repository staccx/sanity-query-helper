import sanityClient from "@sanity/client"

const generateOrderBy = order => (order ? ` | order(${order})` : "")
const generateProjections = projections =>
  projections ? `{${projections}}` : "{...}"
const generateSelector = selector => selector

class SanityQueryHelper {
  constructor (
    {
      sanityOptions,
      queryOptions,
      order,
      projections,
      selector
    }
  ) {

    if (sanityOptions && !sanityOptions.token) {
      delete sanityOptions.token
    }

    this.sanityOptions = sanityOptions
    this.queryOptions = queryOptions || []
    this.order = order
    this.projections = projections
    this.selector = selector || ""
    if (arguments[1]) {
      this.filter = arguments[1]
    }
  }

  ofType (type) {
    return new SanityQueryHelper(this)
      .withFilter("_type")
      .equalTo(`"${type}"`)
  }

  withFilter (filter) {
    return new SanityQueryHelper(this, filter)
  }

  equalTo (value) {
    return this.compare(value, "==", this.filter)
  }

  notEqualTo (value) {
    return this.compare(value, "!=", this.filter)
  }

  lessThan (value) {
    return this.compare(value, "<", this.filter)
  }

  lessOrEqualTo (value) {
    return this.compare(value, "<=", this.filter)
  }

  greaterThan (value) {
    return this.compare(value, ">", this.filter)
  }

  greaterOrEqualTo (value) {
    return this.compare(value, ">=", this.filter)
  }

  compare (value, operation, key) {
    if (!key) {
      console.warn(
        "You're trying to compare without providing a filter. Always use withFilter first"
      )
      return this
    }
    this.queryOptions.push(`${key} ${operation} ${value}`)
    return new SanityQueryHelper(this, null)
  }

  orderBy (order) {
    this.order = order
    return new SanityQueryHelper(this, null)
  }

  project (projections) {
    this.projections = projections
    return new SanityQueryHelper(this, null)
  }

  select (from, to, inclusive = false) {
    this.selector = `[${from}..${inclusive ? "." : ""}${to}]`
    return new SanityQueryHelper(this, null)
  }

  get query () {
    return `*[${this.queryOptions.join(" && ")}]${generateOrderBy(
      this.order
    )}${generateProjections(this.projections)}${generateSelector(
      this.selector
    )}`
  }

  send () {
    const client = sanityClient(this.sanityOptions)
    return client.fetch(this.query)
  }
}

export default SanityQueryHelper
