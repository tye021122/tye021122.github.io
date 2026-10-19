import ReadingBehavior from "./quartz/components/ReadingBehavior"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { Graph } from "@quartz-community/graph"
import ConditionalRender from "./quartz/components/ConditionalRender"
import HomeRecentNotes from "./quartz/components/HomeRecentNotes"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes/dispatcher"

const config = await loadQuartzConfig()
// Keep authored folder indexes, but never generate virtual folder pages.
// This also keeps those pages out of the shared search/graph content index.
config.plugins.pageTypes = config.plugins.pageTypes?.map((pageType) =>
  pageType.name === "FolderPage" ? { ...pageType, generate: () => [] } : pageType,
)
export default config
export const layout = await loadQuartzLayout()

const homeGraph = ConditionalRender({
  component: Graph({ localGraph: { depth: -1, scale: 0.9 } }),
  condition: (page) => page.fileData.slug === "index",
})

const articleGraph = ConditionalRender({
  component: Graph(),
  condition: (page) => page.fileData.slug !== "index",
})

const homeRecentNotes = ConditionalRender({
  component: HomeRecentNotes,
  condition: (page) =>
    page.fileData.slug === "index" &&
    page.allFiles.some((file) => file.slug !== "index" && file.slug !== "404"),
})

layout.defaults.right = [homeGraph, articleGraph, ...(layout.defaults.right ?? [])]
layout.defaults.afterBody = [...(layout.defaults.afterBody ?? []), homeRecentNotes]
layout.byPageType.content.right = layout.defaults.right
layout.byPageType.content.afterBody = layout.defaults.afterBody

for (const pageLayout of Object.values(layout.byPageType)) {
  pageLayout.afterBody = [
    ...(pageLayout.afterBody ?? layout.defaults.afterBody ?? []),
    ReadingBehavior,
  ]
}
layout.defaults.afterBody = [...(layout.defaults.afterBody ?? []), ReadingBehavior]

config.plugins.emitters = config.plugins.emitters.map((emitter) =>
  emitter.name === "PageTypeDispatcher" ? PageTypeDispatcher(layout) : emitter,
)
