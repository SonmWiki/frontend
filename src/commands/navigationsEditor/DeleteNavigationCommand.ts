import { NavigationCommand } from "@/commands/navigationsEditor/NavigationCommand"
import type { GetNavigationsTreeResponseElement } from "@/api"
import type { NavigationEditorService } from "@/service/NavigationEditorService"
import { InsertNavigationCommand } from "@/commands/navigationsEditor/InsertNavigationCommand"

export class DeleteNavigationCommand extends NavigationCommand {
  private readonly id: number
  private deletedData: {
    element: GetNavigationsTreeResponseElement,
    parentId: number | null,
    index: number
  } | undefined

  constructor(
    receiver: NavigationEditorService,
    id: number
  ) {
    super(receiver)
    this.id = id
  }

  public execute() {
    this.deletedData = this.receiver.deleteNavigation(this.id)
  }

  public undo() {
    if (this.deletedData) {
      const insertCommand = new InsertNavigationCommand(this.receiver, this.deletedData.element, this.deletedData.parentId, this.deletedData.index)
      insertCommand.execute()
    }
  }
}