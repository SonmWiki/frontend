import type {
  GetCategoriesTreeResponseElement,
  GetNavigationsTreeResponseElement,
  UpdateNavigationsTreeCommandElement,
} from "@/api"
import {
  type WikiSidebarTreeNode,
  WikiSidebarTreeNodeType,
} from "@/components/navigation/sidebar/WikiSidebarTreeNode"

export class MapperService {
  static mapGetNavigationsTreeResponseElementToTreeNode = (
    navigation: GetNavigationsTreeResponseElement,
  ): WikiSidebarTreeNode => {
    function getNodeType(navigation: GetNavigationsTreeResponseElement): WikiSidebarTreeNodeType {
      if (navigation.uri == null) {
        return navigation.children.length > 0
          ? WikiSidebarTreeNodeType.TEXT
          : WikiSidebarTreeNodeType.HEADER
      }

      return navigation.uri.match(`^https?://`)
        ? WikiSidebarTreeNodeType.EXTERNAL_URL
        : WikiSidebarTreeNodeType.INTERNAL_URL
    }

    return {
      key: navigation.id.toString(),
      label: navigation.name,
      type: getNodeType(navigation),
      icon: navigation.icon,
      uri: navigation.uri,
      children: navigation.children.map((x) =>
        this.mapGetNavigationsTreeResponseElementToTreeNode(x),
      ),
    }
  }

  static mapGetNavigationsTreeResponseElementToUpdateNavigationsTreeCommandElement = (
    navigation: GetNavigationsTreeResponseElement,
  ): UpdateNavigationsTreeCommandElement => {
    return {
      name: navigation.name,
      uri: navigation.uri,
      icon: navigation.icon,
      children: navigation.children.map(
        this.mapGetNavigationsTreeResponseElementToUpdateNavigationsTreeCommandElement,
      ),
    }
  }

  static mapGetCategoriesTreeResponseElementToTreeNode = (
    category: GetCategoriesTreeResponseElement,
  ): WikiSidebarTreeNode => {
    return {
      key: category.id.toString(),
      label: category.name,
      type: WikiSidebarTreeNodeType.INTERNAL_URL,
      uri: `/categories/${category.id}`,
      icon: null,
      children: category.children.map((x) => this.mapGetCategoriesTreeResponseElementToTreeNode(x)),
    }
  }
}
