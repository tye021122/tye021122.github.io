import { ComponentChildren } from "preact"
import { QuartzComponent } from "../types"
import { htmlToJsx } from "../../util/jsx"
import { FilePath, resolveRelative, slugifyFilePath } from "../../util/path"
import { byDateAndAlphabetical } from "../PageList"
import { Date, getDate } from "../Date"
import style from "../styles/home.scss"

const notebooks = [
  {
    name: "학습 노트",
    description: "전공 수업부터 자격증 공부까지, 배운 것을 내 언어로 정리합니다.",
  },
  {
    name: "개발 노트",
    description: "아이디어를 만들고, 문제를 해결하며 쌓아가는 개발 기록입니다.",
  },
  { name: "취미 노트", description: "영화와 책, 게임 속에서 발견한 좋아하는 것들을 남깁니다." },
]

const Home: QuartzComponent = ({ fileData, tree, allFiles, cfg }) => {
  // 발행된 실제 글만 모아 설정된 날짜 기준으로 정렬.
  const notes = allFiles
    .filter((file) => file.slug && file.slug !== "index" && !file.slug.endsWith("/index"))
    .sort(byDateAndAlphabetical(cfg))

  return (
    <article class="home-page popover-hint">
      <section class="home-intro" aria-labelledby="home-title">
        <p class="home-eyebrow">NOTE OF TYE / 공부 · 개발 · 취미</p>
        <h1 id="home-title">{cfg.pageTitle}</h1>
        <div class="home-description">
          {htmlToJsx(fileData.filePath!, tree) as ComponentChildren}
        </div>
      </section>
      <section class="home-notebooks" aria-label="노트 카테고리">
        {notebooks.map((notebook, index) => {
          const folder = slugifyFilePath(notebook.name as FilePath)
          const count = notes.filter((note) => note.slug!.startsWith(`${folder}/`)).length
          const content = (
            <>
              <span class="home-number">0{index + 1} /</span>
              <h2>{notebook.name}</h2>
              <p>{notebook.description}</p>
              <span class="home-category-meta">
                {count ? `${count}개의 기록 ↗` : "첫 기록을 준비하고 있어요"}
              </span>
            </>
          )
          return count ? (
            <a
              key={folder}
              class="internal home-notebook"
              href={resolveRelative(fileData.slug!, folder)}
            >
              {content}
            </a>
          ) : (
            <div key={folder} class="home-notebook">
              {content}
            </div>
          )
        })}
      </section>
      <section class="home-recent" aria-labelledby="home-recent-title">
        <div class="home-section-heading">
          <h2 id="home-recent-title">최근 기록</h2>
          <span>{cfg.defaultDateType === "modified" ? "최근 수정순" : "최근 날짜순"}</span>
        </div>
        <ul>
          {notes.slice(0, 6).map((note) => {
            const date = getDate(cfg, note)
            return (
              <li key={note.slug}>
                <a
                  class="internal home-note-link"
                  href={resolveRelative(fileData.slug!, note.slug!)}
                >
                  <span class="home-note-category">
                    {note.slug!.split("/")[0].replace(/-/g, " ")}
                  </span>
                  <span class="home-note-title">{note.frontmatter?.title ?? note.slug}</span>
                  {date && <Date date={date} locale="ko-KR" />}
                  <span class="home-note-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
        {notes.length === 0 && <p>첫 번째 노트를 준비하고 있어요.</p>}
      </section>
    </article>
  )
}

Home.css = style
export default Home
