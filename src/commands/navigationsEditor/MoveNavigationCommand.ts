import { NavigationCommand } from "@/commands/navigationsEditor/NavigationCommand"
import type { NavigationEditorService } from "@/service/NavigationEditorService"

export class MoveNavigationCommand extends NavigationCommand {
  private readonly id: number
  private readonly oldIndex: number
  private readonly newIndex: number
  private readonly oldParentId: number | null
  private readonly newParentId: number | null

  constructor(
    receiver: NavigationEditorService,
    id: number,
    oldParentId: number | null,
    newParentId: number | null,
    oldIndex: number,
    newIndex: number
  ) {
    super(receiver)
    this.id = id
    this.oldIndex = oldIndex
    this.newIndex = newIndex
    this.oldParentId = oldParentId
    this.newParentId = newParentId
  }

  public execute() {
    this.receiver.moveNavigation(this.id, this.newParentId, this.newIndex)
  }

  public undo() {
    this.receiver.moveNavigation(this.id, this.oldParentId, this.oldIndex)
  }
}