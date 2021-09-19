import { Edge } from "../defs";

export default (edges: Edge[]) => edges.map(edge => edge.node);
