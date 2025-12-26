import { NoteNode } from '../note/ui/NoteNode.jsx'
import { EmojiNode } from '../emoji-sticker/ui/EmojiNode.jsx'
import { ShapeNode } from '../shape/ui/ShapeNode.jsx'
import { MarkdownNode } from '../markdown/ui/MarkdownNode.jsx'
import { RoadmapNode } from '../roadmap/ui/RoadmapNode'

export const nodeTypes = {
  note: NoteNode,
  emoji: EmojiNode,
  shape: ShapeNode,
  markdown: MarkdownNode,
  roadmap: RoadmapNode,
}
