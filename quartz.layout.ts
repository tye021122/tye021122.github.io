import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponent } from "./quartz/components/types"

// 홈에서는 글 메타 정보와 목차·백링크만 숨김.
const articleOnly = (component: QuartzComponent) =>
  Component.ConditionalRender({
    component,
    condition: (page) => page.fileData.slug !== "index",
  })

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/tye021122",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    articleOnly(Component.ArticleTitle()),
    articleOnly(Component.ContentMeta({ showReadingTime: false })),
    articleOnly(Component.TagList()),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    // 홈은 전체 노트 연결을, 개별 글은 주변 연결을 먼저 표시.
    Component.ConditionalRender({
      component: Component.Graph({ localGraph: { depth: -1, scale: 0.9, autoFit: true } }),
      condition: (page) => page.fileData.slug === "index",
    }),
    articleOnly(Component.Graph()),
    articleOnly(Component.DesktopOnly(Component.TableOfContents())),
    articleOnly(Component.Backlinks()),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta({ showReadingTime: false }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
