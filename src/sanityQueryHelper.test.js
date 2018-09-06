import SanityQueryHelper from "./sanityQueryHelper"

const getHelper = () =>
  new SanityQueryHelper({
    sanityOptions: {
      projectId: "test",
      dataset: "prod",
      token: null,
      useCdn: false
    }
  })
describe("Sanity SDK", () => {
  it("Should be able to use ofType", () => {
    expect(getHelper().ofType("post").query).toBe("*[_type == \"post\"]{...}")
  })

  it("Should be able to use multiple values", () => {
    expect(
      getHelper()
        .withFilter("_type")
        .equalTo("post")
        .withFilter("releaseYear")
        .greaterOrEqualTo(1979).query
    ).toBe("*[_type == post && releaseYear >= 1979]{...}")
  })

  describe("Compare", () => {
    it("Do compare", () => {
      expect(
        getHelper()
        .doCompare("something > 100").query).toBe("*[something > 100]{...}")
    })
    it("Greater Than", () => {
      expect(
        getHelper()
          .withFilter("something")
          .greaterThan(100).query
      ).toBe("*[something > 100]{...}")
    })
    it("Greater Or Equal To", () => {
      expect(
        getHelper()
          .withFilter("something")
          .greaterOrEqualTo(100).query
      ).toBe("*[something >= 100]{...}")
    })
    it("Less Or Equal To", () => {
      expect(
        getHelper()
          .withFilter("something")
          .lessOrEqualTo(100).query
      ).toBe("*[something <= 100]{...}")
    })
    it("Less Than", () => {
      expect(
        getHelper()
          .withFilter("something")
          .lessThan(100).query
      ).toBe("*[something < 100]{...}")
    })

    it("Not Equal To", () => {
      expect(
        getHelper()
          .withFilter("something")
          .equalTo(100).query
      ).toBe("*[something == 100]{...}")
    })

    it("Equal To", () => {
      expect(
        getHelper()
          .withFilter("something")
          .notEqualTo(100).query
      ).toBe("*[something != 100]{...}")
    })

    it("Manually with compare", () => {
      expect(
        getHelper()
          .compare("something", SanityQueryHelper.comparisons.notEqualTo, 100).query
      ).toBe("*[something != 100]{...}")
    })

    it("Should fail if no filter is added", () => {
      console.warn = jest.fn();
      expect(
        getHelper()
          .notEqualTo(100).query
      ).toBe("*[]{...}")
      expect(console.warn.mock.calls.length).toBeGreaterThan(0);
    })
  })

  describe("Order", () => {
    it("Should created order", () => {
      expect(
        getHelper()
          .ofType("post")
          .withFilter("releaseYear")
          .greaterOrEqualTo(1979)
          .orderBy("releaseYear").query
      ).toBe(
        "*[_type == \"post\" && releaseYear >= 1979] | order(releaseYear){...}"
      )
    })
  })

  describe("Projections", () => {
    it("Single", () => {
      expect(
        getHelper()
          .ofType("post")
          .pick("title").query
      ).toBe("*[_type == \"post\"]{title}")
    })
    it("Multiple", () => {
      expect(
        getHelper()
          .ofType("post")
          .pick("_id, title, _createdAt").query
      ).toBe("*[_type == \"post\"]{_id, title, _createdAt}")
    })
  })

  describe("Selector", () => {
    it("Non-inclusive", () => {
      expect(
        getHelper()
          .ofType("pages")
          .select(0, 10).query
      ).toBe("*[_type == \"pages\"]{...}[0..10]")
    })
    it("Inclusive", () => {
      expect(
        getHelper()
          .ofType("pages")
          .select(0, 10, true).query
      ).toBe("*[_type == \"pages\"]{...}[0...10]")
    })
  })

  describe("All together now", () => {
    it("Should handle all", () => {
      const query =
        getHelper()
          .ofType("post")
          .withFilter("releaseYear")
          .greaterOrEqualTo(1979)
          .pick("title")
          .select(0, 1000)
          .orderBy("releaseYear").query
      expect(query).toBe("*[_type == \"post\" && releaseYear >= 1979] | order(releaseYear){title}[0..1000]")
    })
  })

  describe("Send", () => {
    test("Should call query", () => {
      const helper = getHelper()
        .withFilter("_type")
        .equalTo("post")
        .pick("title")

      helper.send = jest.fn()

      const response = [{title: "cool"}, {title: "second"}]
      helper.send.mockResolvedValue(response)

      return helper.send().then(result => expect(result.length).toBe(2))
    })
  })
})