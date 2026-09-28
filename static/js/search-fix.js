const search = window.zolaTheme.search

search.toggle = function () {
  this.ElWrapper.classList.remove("hidden")
  const query = prompt("Enter your search term")
  if (query === null) {
    this.ElWrapper.classList.add("hidden")
    return
  }

  if (this.index) {
    this.act(query)
    return
  }

  this.ElResults.innerHTML = "<li>Search: Please wait...</li>"
  if (!this.loading) {
    this.loading = this.SearchFiles.reduce(
      (promise, src) => promise.then(() => this.loadScript(src)),
      Promise.resolve()
    ).then(() => {
      this.index = window.elasticlunr.Index.load(window.searchIndex)
    }).catch(error => {
      this.loading = null
      throw error
    })
  }

  this.loading.then(
    () => this.act(query),
    error => this.showError(
      "<li>Search file not found: <code>" + this.myEscape(String(error)) + "</code></li>"
    )
  )
}

search.act = function (query) {
  const results = this.index.search(query, {})
  if (!results.length) {
    this.showError("<li>No search results for <code>" + this.myEscape(query) + "</code>.</li>")
    return
  }

  const rows = ["<li><strong>" + results.length + "</strong> search " +
    (results.length === 1 ? "result" : "results") + " for <code>" +
    this.myEscape(query) + "</code>:</li>"]
  for (const result of results) {
    rows.push("<li><a href=\"" + this.myEscape(result.ref) + "\">" +
      this.myEscape(result.doc.title) + "</a></li>")
  }
  this.ElResults.innerHTML = rows.join("")
  this.ElResults.scrollIntoView({block: "nearest"})
}

search.showError = function (message) {
  this.ElResults.innerHTML = message
  this.ElResults.scrollIntoView({block: "nearest"})
}
