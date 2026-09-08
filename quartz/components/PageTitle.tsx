import { joinSegments, pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir}>
        <img
          class="page-title-logo"
          src={joinSegments(baseDir, "static/icon-v5-transparent.png")}
          alt=""
          width="32"
          height="32"
        />
        <span>{title}</span>
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
  font-family: var(--titleFont);
}
.page-title > a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 100%;
}
.page-title-logo {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  object-fit: contain;
  margin: 0;
  border-radius: 0;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
