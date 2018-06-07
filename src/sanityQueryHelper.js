import sanityClient from "@sanity/client"

const generateOrderBy = order => (order ? ` | order(${order})` : "")
const generateProjections = projections =>
  projections ? `{${projections}}` : "{...}"
const generateSelector = selector => selector

/**
 * Helper for using SanityQueryHelper.compare
 * @type {{equalTo: string, notEqualTo: string, lessThan: string, lessOrEqualTo: string, greaterThan: string, greaterOrEqualTo: string}}
 */
export const comparisons = {
  equalTo: "==",
  notEqualTo: "!=",
  lessThan: "<",
  lessOrEqualTo: "<=",
  greaterThan: ">",
  greaterOrEqualTo: ">="
}

/**
 * @class
 */
class SanityQueryHelper {
  /**
   * SanityQueryHelper constructor. Mininum new SanityQueryHelper({sanityOptions})
   * @constructor
   * @param {object} sanityOptions - The same options you would pass to the sanityClient
   */
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

  /**
   * Creates a test of type e.g _type == "myType"
   * @param {string} type - The name of the type ex. "post"
   * @returns {SanityQueryHelper}
   */
  ofType (type) {
    return new SanityQueryHelper(this)
      .withFilter("_type")
      .equalTo(`"${type}"`)
  }

  /**
   * Add filter. NOTE: You will need to call compare functions after this e.g withfilter("realeaseYear").greaterThan(2000)
   * @param {string} filter
   * @returns {SanityQueryHelper}
   */
  withFilter (filter) {
    return new SanityQueryHelper(this, filter)
  }

  /**
   * Creates a filter with (filter == value) e.g releaseYear == 1999
   * @param {string} value - Value to compare against
   * @returns {SanityQueryHelper}
   */
  equalTo (value) {
    return this.compare(this.filter, comparisons.equalTo, value)
  }

  /**
   * Creates a filter with (filter != value) e.g movieType != "drama"
   * @param {string} value - Value to compare against
   * @returns {SanityQueryHelper}
   */
  notEqualTo (value) {
    return this.compare(this.filter, comparisons.notEqualTo, value)
  }

  /**
   * Creates a filter with (filter < value) e.g members < 5
   * @param {string} value - Value to compare against
   * @returns {SanityQueryHelper}
   */
  lessThan (value) {
    return this.compare(this.filter, comparisons.lessThan, value)
  }

  /**
   * Creates a filter with (filter <= value) e.g members <= 5
   * @param {string} value - Value to compare against
   * @returns {SanityQueryHelper}
   */
  lessOrEqualTo (value) {
    return this.compare(this.filter, comparisons.lessOrEqualTo, value)
  }

  /**
   * Creates a filter with (filter > value) e.g members > 5
   * @param {string} value - Value to compare against
   * @returns {SanityQueryHelper}
   */
  greaterThan (value) {
    return this.compare(this.filter, comparisons.greaterThan, value)
  }

  /**
   * Creates a filter with (filter <= value) e.g members <= 5
   * @param {string} value - Value to compare against
   * @returns {SanityQueryHelper}
   */
  greaterOrEqualTo (value) {
    return this.compare(this.filter, comparisons.greaterOrEqualTo, value)
  }

  /**
   * Used to create the filters.
   * @example compare("releaseYear", "==", 2000)
   * @param value
   * @param operation
   * @param filter
   * @returns {SanityQueryHelper}
   */
  compare (filter, operation, value) {
    if (!filter) {
      console.warn(
        "You're trying to compare without providing a filter. Always use withFilter first"
      )
      return this
    }
    this.queryOptions.push(`${filter} ${operation} ${value}`)
    return new SanityQueryHelper(this, null)
  }

  /**
   * Adds an ordering variable to the GROQ query e.g order(releaseYear)
   * @example helper.orderBy("releaseYear") -> | order(releaseYear)
   * @param order
   * @returns {SanityQueryHelper}
   */
  orderBy (order) {
    this.order = order
    return new SanityQueryHelper(this, null)
  }

  /**
   * Picks fields from result. In GROQ-speak this is called projections -> Soz, Sanity, project was not an intuitive verb here
   * @link https://www.sanity.io/docs/data-store/how-queries-work#projections
   * @param {string} projections - Which fields to pick. Comma delimited
   * @returns {SanityQueryHelper}
   */
  pick (projections) {
    this.projections = projections
    return new SanityQueryHelper(this, null)
  }

  /**
   * Adds select range. By default sanity selects [0..100]
   * @param {number} from - Index to start from
   * @param {number} to - Index to end
   * @param inclusive - Whether or not to include {to} index value
   * @returns {SanityQueryHelper}
   */
  select (from, to, inclusive = false) {
    this.selector = `[${from}..${inclusive ? "." : ""}${to}]`
    return new SanityQueryHelper(this, null)
  }

  /**
   * Getter for the query string.
   * @returns {string}
   */
  get query () {
    return `*[${this.queryOptions.join(" && ")}]${generateOrderBy(
      this.order
    )}${generateProjections(this.projections)}${generateSelector(
      this.selector
    )}`
  }

  /**
   * Initialize sanityClient and send the finished query.
   * @returns {Promise}
   */
  send () {
    const client = sanityClient(this.sanityOptions)
    return client.fetch(this.query)
  }
}

export default SanityQueryHelper
