import { VisitorContext } from "../defs";

export default (persistedFragmentSpreads: VisitorContext["persistedFragmentSpreads"]) =>
  persistedFragmentSpreads.map(([name]) => name);
