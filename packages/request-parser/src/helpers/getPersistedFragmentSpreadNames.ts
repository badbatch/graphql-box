import { VisitorContext } from "..";

export default (persistedFragmentSpreads: VisitorContext["persistedFragmentSpreads"]) =>
  persistedFragmentSpreads.map(([name]) => name);
