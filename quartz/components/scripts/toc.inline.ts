function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
}

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const button = toc.querySelector(".toc-header")
    const content = toc.querySelector(".toc-content")
    if (!button || !content) return
    button.addEventListener("click", toggleToc)
    window.addCleanup(() => button.removeEventListener("click", toggleToc))
  }
}

document.addEventListener("nav", () => {
  setupToc()

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".toc a[data-for]"))
  const ids = new Set(links.map((link) => link.dataset.for))
  const headers = Array.from(
    document.querySelectorAll<HTMLElement>("article :is(h1,h2,h3,h4,h5,h6)[id]"),
  ).filter((header) => ids.has(header.id))
  if (!headers.length) return

  let frame = 0
  // 화면 상단 기준선을 지난 마지막 제목 하나만 현재 구간으로 표시.
  function update() {
    frame = 0
    const line = Math.min(160, window.innerHeight * 0.2)
    let active = headers[0]
    for (const header of headers) {
      if (header.getBoundingClientRect().top <= line) active = header
    }
    const atBottom =
      window.scrollY > 0 &&
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    if (atBottom) active = headers[headers.length - 1]
    for (const link of links) {
      const current = link.dataset.for === active.id
      link.classList.toggle("in-view", current)
      if (current) link.setAttribute("aria-current", "location")
      else link.removeAttribute("aria-current")
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(update)
  }
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
  window.addEventListener("hashchange", schedule)
  const resizeObserver = new ResizeObserver(schedule)
  const article = document.querySelector("article")
  if (article) resizeObserver.observe(article)
  update()
  window.addCleanup(() => {
    cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    window.removeEventListener("scroll", schedule)
    window.removeEventListener("resize", schedule)
    window.removeEventListener("hashchange", schedule)
  })
})
