import { QuartzComponent } from "./types"

const ReadingBehavior: QuartzComponent = ({ allFiles }) => {
  const folders = allFiles
    .filter((file) => file.slug?.endsWith("/index") && file.filePath)
    .map((file) => file.slug!.slice(0, -6))
  const ancestors = new Set<string>()
  for (const file of allFiles) {
    const parts = (file.slug ?? "").split("/")
    for (let i = 1; i < parts.length; i++) ancestors.add(parts.slice(0, i).join("/"))
  }
  const blocked = [...ancestors].filter((slug) => !folders.includes(slug))
  return (
    <div
      id="reading-behavior"
      hidden
      data-index-folders={JSON.stringify(folders)}
      data-blocked-folders={JSON.stringify(blocked)}
    />
  )
}

ReadingBehavior.afterDOMLoaded = String.raw`
document.addEventListener("nav", () => {
  const links = Array.from(document.querySelectorAll(".toc a[data-for]"))
  const ids = new Set(links.map(link => link.dataset.for))
  const headings = Array.from(document.querySelectorAll("article :is(h1,h2,h3,h4,h5,h6)[id]")).filter(h => ids.has(h.id))
  let frame = 0
  function update() {
    frame = 0
    if (!headings.length) return
    let active = headings[0]
    for (const heading of headings) if (heading.getBoundingClientRect().top <= Math.min(160, innerHeight * 0.2)) active = heading
    if (scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2) active = headings[headings.length - 1]
    for (const link of links) {
      if (link.dataset.for === active.id) link.setAttribute("aria-current", "location")
      else link.removeAttribute("aria-current")
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update) }
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
  const resize = new ResizeObserver(schedule)
  const article = document.querySelector("article")
  if (article) resize.observe(article)
  update()

  const blocked = new Set(JSON.parse(document.getElementById("reading-behavior")?.dataset.blockedFolders || "[]"))

  const explorer = document.querySelector(".explorer")
  function cleanExplorerTitles() {
    explorer?.querySelectorAll(".folder-title, .explorer-content li > a").forEach((item) => {
      const cleaned = (item.textContent || "").replace(/^\[[^\]]+\]\s*/, "")
      if (item.textContent !== cleaned) item.textContent = cleaned
    })
  }
  const explorerObserver = new MutationObserver(cleanExplorerTitles)
  if (explorer) explorerObserver.observe(explorer, { childList: true, subtree: true })
  cleanExplorerTitles()

  const listing = document.querySelector(".page-listing .section-ul")
  if (listing) {
    const controls = document.createElement("div")
    controls.className = "folder-sort"
    controls.setAttribute("aria-label", "글 정렬")
    controls.innerHTML = '<button type="button" data-order="newest" aria-pressed="true">최근 글순</button><button type="button" data-order="oldest" aria-pressed="false">오래된 순</button>'
    listing.parentElement?.prepend(controls)

    const buttons = Array.from(controls.querySelectorAll("button"))
    function sortListing(order) {
      const items = Array.from(listing.querySelectorAll(":scope > .section-li"))
      items.sort((a, b) => {
        const aDate = Date.parse(a.querySelector("time")?.dateTime || "")
        const bDate = Date.parse(b.querySelector("time")?.dateTime || "")
        if (Number.isNaN(aDate) && Number.isNaN(bDate)) return 0
        if (Number.isNaN(aDate)) return 1
        if (Number.isNaN(bDate)) return -1
        return order === "oldest" ? aDate - bDate : bDate - aDate
      })
      items.forEach((item) => listing.append(item))
      buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.order === order)))
    }
    buttons.forEach((button) => button.addEventListener("click", () => sortListing(button.dataset.order)))
    sortListing("newest")
  }

  function isBlocked(link) {
    const url = new URL(link.href, location.href)
    return url.origin === location.origin && blocked.has(decodeURIComponent(url.pathname).replace(/\/?index(?:\.html)?$/, "").replace(/^\/+|\/+$/g, ""))
  }
  // Remove navigation from breadcrumbs and generated folder listings, including keyboard/open-in-new-tab use.
  for (const link of document.querySelectorAll("a[href]")) {
    if (link.closest(".explorer") || !isBlocked(link)) continue
    const label = document.createElement("span")
    label.className = "folder-label"
    label.append(...link.childNodes)
    link.replaceWith(label)
  }
  function folderClick(event) {
    const link = event.target.closest?.("a[href]")
    if (!link || !isBlocked(link)) return
    event.preventDefault()
    event.stopImmediatePropagation()
    link.closest(".folder-container")?.querySelector(".folder-icon")?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
  }
  document.addEventListener("click", folderClick, true)
  window.addCleanup(() => {
    cancelAnimationFrame(frame)
    resize.disconnect()
    explorerObserver.disconnect()
    window.removeEventListener("scroll", schedule)
    window.removeEventListener("resize", schedule)
    document.removeEventListener("click", folderClick, true)
  })
})
`
export default ReadingBehavior
