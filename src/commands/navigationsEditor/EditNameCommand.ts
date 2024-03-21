import { NavigationCommand } from '@/commands/navigationsEditor/NavigationCommand'
import type { NavigationEditorService } from '@/service/NavigationEditorService'

export class EditNameCommand extends NavigationCommand {
  private readonly id: number
  private readonly newName: string
  private oldName: string | undefined

  constructor(
    receiver: NavigationEditorService,
    id: number,
    newName: string
  ) {
    super(receiver)
    this.id = id
    this.newName = newName
  }

  public execute() {
    this.oldName = this.receiver.editName(this.id, this.newName)
  }

  public undo() {
    if(this.oldName)
      this.receiver.editName(this.id, this.oldName)
  }
}