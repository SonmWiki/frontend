import type { NavigationEditorService } from '@/service/NavigationEditorService'
import type { Command } from '@/commands/Command'

export abstract class NavigationCommand implements Command{
  protected readonly receiver: NavigationEditorService

  protected constructor(receiver: NavigationEditorService,) {
    this.receiver = receiver;
  }

  abstract execute() : void

  abstract undo() : void
}