import type { GetCategoriesTreeResponseElement, GetNavigationsTreeResponseElement } from '@/api'
import type { TreeNode } from 'primevue/treenode'

export class MapperService {
    static mapGetNavigationsTreeResponseElementToTreeNode = (navigation: GetNavigationsTreeResponseElement) : TreeNode => {
    function getNodeType(navigation: GetNavigationsTreeResponseElement): string {
      if (navigation.uri == null) {
        return navigation.children.length > 0 ? 'text' : 'header'
      }
      return navigation.uri.match(`^https?://`) ? 'ext' : 'int'
    }

    return {
      key: navigation.id.toString(),
      label: navigation.name,
      type: getNodeType(navigation),
      weight: navigation.weight,
      icon: navigation.icon ?? undefined,
      uri: navigation.uri,
      children: navigation.children.map(x=> this.mapGetNavigationsTreeResponseElementToTreeNode(x))
    }
  }

  static mapGetCategoriesTreeResponseElementToTreeNode = (category: GetCategoriesTreeResponseElement) : TreeNode => {
      return {
        key: category.id.toString(),
        label: category.name,
        type: "int",
        uri: `/category/${category.id}`,
        children: category.children.map(x => this.mapGetCategoriesTreeResponseElementToTreeNode(x))
      }
  }
}