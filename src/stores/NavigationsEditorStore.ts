import { defineStore } from "pinia"
import { computed, ref } from "vue"
import type { GetNavigationsTreeResponseElement } from "@/api"

const useTreeEditorStore = defineStore("navigationsEditor", () => {
    const navigations = ref(new Array<GetNavigationsTreeResponseElement>())
    const serializedNavigations = computed(() => {
      return JSON.stringify(navigations.value)
    })
    const lastId = ref(0)
    const undoStack = ref(new Array<Command>())
    const redoStack = ref(new Array<Command>())

    interface Command {
      execute(): void;

      undo(): void;
    }

    class AddElementCommand implements Command {
      private readonly parentId: number | null
      private readonly index: number
      private readonly element: GetNavigationsTreeResponseElement

      constructor(parentId: number | null, index: number, element: GetNavigationsTreeResponseElement) {
        this.parentId = parentId
        this.index = index
        this.element = element
      }

      private tryInsert(array: Array<GetNavigationsTreeResponseElement>): boolean {
        try {
          array.splice(this.index, 0, this.element)
          return true
        } catch (e) {
          return false
        }
      }

      private traverseTryInsert(array: Array<GetNavigationsTreeResponseElement>): boolean {
        for (let i = 0; i < array.length; i++) {
          if (array[i].id === this.parentId) {
            return this.tryInsert(array[i].children)
          }
          if (this.traverseTryInsert(array[i].children)) return true
        }
        return false
      }

      public execute(): void {
        if (this.parentId === null) {
          this.tryInsert(navigations.value)
        } else {
          this.traverseTryInsert(navigations.value)
        }
      }

      public undo(): void {
        new RemoveElementCommand(this.element.id).execute()
      }
    }

    class RemoveElementCommand implements Command {
      private readonly id: number
      private removedElementParentId!: number | null
      private removedElementIndex!: number
      private removedElement!: GetNavigationsTreeResponseElement

      constructor(id: number) {
        this.id = id
      }

      private traverseTryRemove(array: Array<GetNavigationsTreeResponseElement>, parentId: number | null): boolean {
        for (let i = 0; i < array.length; i++) {
          if (array[i].id === this.id) {
            this.removedElement = array[i]
            this.removedElementIndex = i
            this.removedElementParentId = parentId
            array.splice(i, 1)
            return true
          }
          if (this.traverseTryRemove(array[i].children, array[i].id)) return true
        }
        return false
      }

      public execute(): void {
        this.traverseTryRemove(navigations.value, null)
      }

      public getRemovedElement(): GetNavigationsTreeResponseElement {
        return this.removedElement
      }

      public undo(): void {
        new AddElementCommand(this.removedElementParentId, this.removedElementIndex, this.removedElement).execute()
      }
    }

    class MoveElementCommand implements Command {
      private readonly id: number
      private readonly oldIndex: number
      private readonly newIndex: number
      private readonly oldParentId: number | null
      private readonly newParentId: number | null

      constructor(id: number, oldIndex: number, newIndex: number, oldParentId: number | null, newParentId: number | null) {
        this.id = id
        this.oldIndex = oldIndex
        this.newIndex = newIndex
        this.oldParentId = oldParentId
        this.newParentId = newParentId
      }

      public execute(): void {
        const removeCommand = new RemoveElementCommand(this.id)
        removeCommand.execute()
        new AddElementCommand(this.newParentId, this.newIndex, removeCommand.getRemovedElement()).execute()
      }

      public undo(): void {
        new MoveElementCommand(this.id, this.newIndex, this.oldIndex, this.newParentId, this.oldParentId).execute()
      }
    }

    class EditIconCommand implements Command {
      private readonly id: number
      private readonly newIcon: string | null
      private oldIcon!: string | null

      constructor(id: number, icon: string | null) {
        this.id = id
        this.newIcon = icon
      }

      private traverseTryEdit(array: Array<GetNavigationsTreeResponseElement>): boolean {
        for (let i = 0; i < array.length; i++) {
          if (array[i].id === this.id) {
            this.oldIcon = array[i].icon
            array[i].icon = this.newIcon
            return true
          }
          if (this.traverseTryEdit(array[i].children)) return true
        }
        return false
      }

      public execute(): void {
        this.traverseTryEdit(navigations.value)
      }

      public undo(): void {
        new EditIconCommand(this.id, this.oldIcon).execute()
      }
    }

    class EditNameCommand implements Command {
      private readonly id: number
      private readonly newName: string
      private oldName!: string

      constructor(id: number, name: string) {
        this.id = id
        this.newName = name
      }

      private traverseTryEdit(array: Array<GetNavigationsTreeResponseElement>): boolean {
        for (let i = 0; i < array.length; i++) {
          if (array[i].id === this.id) {
            this.oldName = array[i].name
            array[i].name = this.newName
            return true
          }
          if (this.traverseTryEdit(array[i].children)) return true
        }
        return false
      }

      public execute(): void {
        this.traverseTryEdit(navigations.value)
      }

      public undo(): void {
        new EditNameCommand(this.id, this.oldName).execute()
      }
    }

    class EditLinkCommand implements Command {
      private readonly id: number
      private readonly newLink: string | null
      private oldLink!: string | null

      constructor(id: number, link: string | null) {
        this.id = id
        this.newLink = link
      }

      private traverseTryEdit(array: Array<GetNavigationsTreeResponseElement>): boolean {
        for (let i = 0; i < array.length; i++) {
          if (array[i].id === this.id) {
            this.oldLink = array[i].uri!
            array[i].uri = this.newLink
            return true
          }
          if (this.traverseTryEdit(array[i].children)) return true
        }
        return false
      }

      public execute(): void {
        this.traverseTryEdit(navigations.value)
      }

      public undo(): void {
        new EditLinkCommand(this.id, this.oldLink).execute()
      }
    }

    const performCommand = (command: Command) => {
      command.execute()
      redoStack.value.splice(0, redoStack.value.length)
      undoStack.value.push(command)
    }

    const addElement = (parentId: number | null, index: number, element: GetNavigationsTreeResponseElement) =>
      performCommand(new AddElementCommand(parentId, index, element))

    const removeElement = (id: number) =>
      performCommand(new RemoveElementCommand(id))

    const moveElement = (id: number, oldIndex: number, newIndex: number, oldParent: number | null, newParent: number | null) =>
      performCommand(new MoveElementCommand(id, oldIndex, newIndex, oldParent, newParent))

    const editIcon = (id: number, icon: string | null) =>
      performCommand(new EditIconCommand(id, icon))

    const editName = (id: number, name: string) =>
      performCommand(new EditNameCommand(id, name))

    const editLink = (id: number, link: string | null) =>
      performCommand(new EditLinkCommand(id, link))

    const undo = () => {
      const element = undoStack.value.pop()
      if (element) {
        redoStack.value.push(element)
        element.undo()
      }
    }

    const redo = () => {
      const element = redoStack.value.pop()
      if (element) {
        undoStack.value.push(element)
        element.execute()
      }
    }

    const clearHistory = () => {
      undoStack.value.splice(0, undoStack.value.length)
      redoStack.value.splice(0, redoStack.value.length)
    }

    return {
      navigations,
      lastId,
      undoStack,
      redoStack,
      serializedNavigations,
      addElement,
      removeElement,
      moveElement,
      editIcon,
      editName,
      editLink,
      undo,
      redo,
      clearHistory
    }
  }
)

export default useTreeEditorStore
