import { NavigationCommand } from "@/commands/navigationsEditor/NavigationCommand"
import type { NavigationEditorService } from "@/service/NavigationEditorService"

export class EditUriCommand extends NavigationCommand {
  private readonly id: number
  private readonly newUri: string | null
  private oldUri: string | null | undefined

  constructor(
    receiver: NavigationEditorService,
    id: number,
    newUri: string | null
  ) {
    super(receiver)
    this.id = id
    this.newUri = newUri
  }

  public execute() {
    this.oldUri = this.receiver.editUri(this.id, this.newUri)
  }

  public undo() {
    if (this.oldUri)
      this.receiver.editUri(this.id, this.newUri)
  }
}