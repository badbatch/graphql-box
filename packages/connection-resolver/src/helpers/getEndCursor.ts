import { Edge } from "../defs";

export default (edges: Edge[]) => edges[edges.length - 1].cursor;
