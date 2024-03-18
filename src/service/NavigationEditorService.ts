import type { GetNavigationsTreeResponseElement } from '@/api'
import { api } from '@/api/api'
import { NavigationCommand } from '@/commands/navigationsEditor/NavigationCommand'
import { type DeepReadonly, reactive, readonly } from 'vue'

export class NavigationEditorService {
  private _navigations: GetNavigationsTreeResponseElement[] = reactive([])
  private _undoStack: NavigationCommand[] = reactive([])
  private _redoStack: NavigationCommand[] = reactive([])
  private _lastId: number = 0
  public navigations: DeepReadonly<GetNavigationsTreeResponseElement[]> = readonly(this._navigations)
  public undoStack: DeepReadonly<NavigationCommand[]> = readonly(this._undoStack)
  public redoStack: DeepReadonly<NavigationCommand[]> = readonly(this._redoStack)

  get lastId(): number {
    return this._lastId
  }

  public async setup() {
    try {
      const data = (await api().api.getNavigationsTree()).data.data
      this._navigations.push(...data)
    } catch (error) {
      console.log(error)
    }
    const nodesToVisit = [...this.navigations]
    while (nodesToVisit.length > 0) {
      const node = nodesToVisit.pop()!
      this._lastId = Math.max(node.id, this._lastId)
      nodesToVisit.push(...node.children)
    }
  }

  public insertNavigation(element: GetNavigationsTreeResponseElement, parentId: number | null, index: number) {
    const root: { id: number | null, children: GetNavigationsTreeResponseElement[] }
      = { id: null, children: this._navigations }

    if(element.id > this._lastId)
      this._lastId++

    const nodesToVisit = [root]
    while (nodesToVisit.length > 0) {
      const node = nodesToVisit.pop()!
      if (node.id === parentId) {
        node.children.splice(index, 0, element)
        return
      }
      nodesToVisit.push(...node.children)
    }
  }

  public deleteNavigation(id: number) {
    const root: { id: number | null, children: GetNavigationsTreeResponseElement[] }
      = { id: null, children: this._navigations }

    const nodesToVisit = [root]
    while (nodesToVisit.length > 0) {
      const node = nodesToVisit.pop()!
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].id === id) {
          const removedElement = node.children[i]
          const removedElementIndex = i
          const removedElementParentId = node.id
          node.children.splice(i, 1)
          return { element: removedElement, index: removedElementIndex, parentId: removedElementParentId }
        }
      }
      nodesToVisit.push(...node.children)
    }
  }

  public moveNavigation(id: number, newParentId: number | null, newIndex: number) {
    const removedNavigation = this.deleteNavigation(id)
    if (removedNavigation)
      this.insertNavigation(removedNavigation.element, newParentId, newIndex)
  }

  public editIcon(id: number, icon: string | null): string | null | undefined {
    const nodesToVisit: GetNavigationsTreeResponseElement[][] = [this._navigations]
    while (nodesToVisit.length > 0) {
      const node = nodesToVisit.pop()!
      for (let i = 0; i < node.length; i++) {
        if (node[i].id === id) {
          const oldIcon = node[i].icon
          node[i].icon = icon
          return oldIcon
        }
        nodesToVisit.push(node[i].children)
      }
    }
  }

  public editName(id: number, name: string): string | undefined {
    const nodesToVisit: GetNavigationsTreeResponseElement[][] = [this._navigations]
    while (nodesToVisit.length > 0) {
      const node = nodesToVisit.pop()!
      for (let i = 0; i < node.length; i++) {
        if (node[i].id === id) {
          const oldName = node[i].name
          node[i].name = name
          return oldName
        }
        nodesToVisit.push(node[i].children)
      }
    }
  }

  public editUri(id: number, uri: string | null): string | null | undefined {
    const nodesToVisit: GetNavigationsTreeResponseElement[][] = [this._navigations]
    while (nodesToVisit.length > 0) {
      const node = nodesToVisit.pop()!
      for (let i = 0; i < node.length; i++) {
        if (node[i].id === id) {
          const oldUri = node[i].uri
          node[i].uri = uri
          return oldUri
        }
        nodesToVisit.push(node[i].children)
      }
    }
  }

  public performCommand(command: NavigationCommand){
    command.execute()
    this._undoStack.push(command)
    this._redoStack.splice(0, this.redoStack.length)
  }

  public undo(){
    const command = this._undoStack.pop()
    if(command){
      command.undo()
      this._redoStack.push(command)
    }
  }

  public redo() {
    const command = this._redoStack.pop()
    if(command) {
      command.execute()
      this._undoStack.push(command)
    }
  }
}