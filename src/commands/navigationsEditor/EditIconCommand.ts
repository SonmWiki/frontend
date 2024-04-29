import { NavigationCommand } from "@/commands/navigationsEditor/NavigationCommand"
import type { NavigationEditorService } from "@/service/NavigationEditorService"

export class EditIconCommand extends NavigationCommand {
  private readonly id: number
  private readonly newIcon: string | null
  private oldIcon: string | null | undefined

  constructor(
    receiver: NavigationEditorService,
    id: number,
    newIcon: string | null
  ) {
    super(receiver)
    this.id = id
    this.newIcon = newIcon
  }

  public execute() {
    this.oldIcon = this.receiver.editIcon(this.id, this.newIcon)
  }

  public undo() {
    if (this.oldIcon)
      this.receiver.editIcon(this.id, this.oldIcon)
  }
}