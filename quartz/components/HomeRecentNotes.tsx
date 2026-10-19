import { RecentNotes } from "@quartz-community/recent-notes"
import { JSX } from "preact"
import { QuartzComponent, QuartzComponentProps } from "./types"

const recentNotes = {
  component: RecentNotes({
    title: "최근 기록",
    limit: 10000,
    linkToMore: false,
    showTags: false,
    hideTagPages: true,
    hideFolderPages: true,
    filter: (page) => page.slug !== "404" && page.slug !== "index",
  }),
}

const HomeRecentNotes: QuartzComponent = (props: QuartzComponentProps) => {
  return (
    <section class="home-recent" aria-labelledby="home-recent-title">
      <div class="home-recent-header">
        <h2 id="home-recent-title">최근 기록</h2>
        <div class="recent-sort" aria-label="최근 기록 정렬">
          <button type="button" data-recent-order="newest" aria-pressed="true">
            최신순
          </button>
          <button type="button" data-recent-order="oldest" aria-pressed="false">
            오래된 순
          </button>
        </div>
      </div>
      {recentNotes.component(props) as JSX.Element}
    </section>
  )
}

HomeRecentNotes.css = recentNotes.component.css
HomeRecentNotes.afterDOMLoaded = String.raw`
  document.addEventListener("nav", () => {
    const root = document.querySelector(".home-recent")
    const list = root?.querySelector(".recent-ul")
    const buttons = root?.querySelectorAll("[data-recent-order]")
    if (!root || !list || !buttons) return

    const sortRecentNotes = (order) => {
      const items = Array.from(list.querySelectorAll(".recent-li"))
      items.sort((a, b) => {
        const aDate = Date.parse(a.querySelector("time")?.dateTime ?? "")
        const bDate = Date.parse(b.querySelector("time")?.dateTime ?? "")
        if (Number.isNaN(aDate) && Number.isNaN(bDate)) return 0
        if (Number.isNaN(aDate)) return 1
        if (Number.isNaN(bDate)) return -1
        return order === "oldest" ? aDate - bDate : bDate - aDate
      })

      items.forEach((item) => list.append(item))
      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.recentOrder === order))
      })
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => sortRecentNotes(button.dataset.recentOrder))
    })
    sortRecentNotes("newest")
  })
`

export default HomeRecentNotes
