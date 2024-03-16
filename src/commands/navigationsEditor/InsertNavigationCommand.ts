import type { NavigationEditorService } from '@/service/NavigationEditorService'
import type { GetNavigationsTreeResponseElement } from '@/api'
import { NavigationCommand } from '@/commands/navigationsEditor/NavigationCommand'

export class InsertNavigationCommand extends NavigationCommand {
  private readonly element: GetNavigationsTreeResponseElement
  private readonly parentId: number | null
  private readonly index: number

  constructor(
    receiver: NavigationEditorService,
    element: GetNavigationsTreeResponseElement,
    parentId: number | null,
    index: number
  ) {
    super(receiver)
    this.element = element
    this.parentId = parentId
    this.index = index
  }

  public execute() {
    this.receiver.insertNavigation(this.element, this.parentId, this.index)
  }

  public undo() {
    this.receiver.deleteNavigation(this.element.id)
  }
}