import type { RouteGraph, RouteNode } from './types';

export class GraphResolver {
  private graph: RouteGraph;

  constructor(graph: RouteGraph) {
    this.graph = graph;
  }

  public getRelatedRoutes(nodeId: string): RouteNode[] {
    const edges = this.graph.edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);

    const relatedIds = edges.map((edge) => (edge.from === nodeId ? edge.to : edge.from));

    return this.graph.nodes.filter((node) => relatedIds.includes(node.id));
  }

  public getChildren(nodeId: string): RouteNode[] {
    const childIds = this.graph.edges.filter((edge) => edge.from === nodeId && edge.relation === 'child').map((edge) => edge.to);

    return this.graph.nodes.filter((node) => childIds.includes(node.id));
  }

  public getParent(nodeId: string): RouteNode | null {
    const edge = this.graph.edges.find((edge) => edge.to === nodeId && edge.relation === 'child');

    if (!edge) return null;

    return this.graph.nodes.find((node) => node.id === edge.from) || null;
  }
}
