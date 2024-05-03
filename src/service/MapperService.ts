import type {
  GetCategoriesTreeResponseElement,
  GetNavigationsTreeResponseElement,
  UpdateNavigationsTreeCommandElement
} from "@/api"
import type { TreeNode } from "primevue/treenode"

export class MapperService {
  static mapGetNavigationsTreeResponseElementToTreeNode = (navigation: GetNavigationsTreeResponseElement): TreeNode => {
    function getNodeType(navigation: GetNavigationsTreeResponseElement): string {
      if (navigation.uri == null) {
        return navigation.children.length > 0 ? "text" : "header"
      }
      return navigation.uri.match(`^https?://`) ? "ext" : "int"
    }

    return {
      key: navigation.id.toString(),
      label: navigation.name,
      type: getNodeType(navigation),
      weight: navigation.weight,
      icon: navigation.icon ?? undefined,
      uri: navigation.uri,
      children: navigation.children.map(x => this.mapGetNavigationsTreeResponseElementToTreeNode(x))
    }
  }

  static mapGetNavigationsTreeResponseElementToUpdateNavigationsTreeCommandElement
    = (navigation: GetNavigationsTreeResponseElement): UpdateNavigationsTreeCommandElement => {
    return {
      name: navigation.name,
      uri: navigation.uri,
      icon: navigation.icon,
      children: navigation.children.map(this.mapGetNavigationsTreeResponseElementToUpdateNavigationsTreeCommandElement)
    }
  }

  static mapGetCategoriesTreeResponseElementToTreeNode = (category: GetCategoriesTreeResponseElement): TreeNode => {
    return {
      key: category.id.toString(),
      label: category.name,
      type: "int",
      uri: `/categories/${category.id}`,
      children: category.children.map(x => this.mapGetCategoriesTreeResponseElementToTreeNode(x))
    }
  }
}