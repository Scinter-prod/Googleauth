import { useNotesStore } from "@/store/notes"

export const backlinksPlugin = {
  id: "backlinks",
  name: "Backlinks",
  enabled: true,
  run: () => {
    const { notes, currentNote } = useNotesStore.getState()
    if (currentNote) {
      const backlinks = notes.filter((note) => note.content.includes(`[[${currentNote.title}]]`))
      console.log(
        "Backlinks:",
        backlinks.map((note) => note.title),
      )
    }
  },
}

export const tagsPlugin = {
  id: "tags",
  name: "Tags",
  enabled: true,
  run: () => {
    const { notes } = useNotesStore.getState()
    const tags = new Set(notes.flatMap((note) => note.tags))
    console.log("All tags:", Array.from(tags))
  },
}

export function runPlugins() {
  const { plugins } = useNotesStore.getState()
  plugins.forEach((plugin) => {
    if (plugin.enabled) {
      plugin.run()
    }
  })
}

