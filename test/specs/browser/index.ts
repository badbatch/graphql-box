import testMutationOperation from "./mutation";
import testQueryOperation from "./query";
import { browserArgs, workerArgs } from "../../helpers";

testQueryOperation(workerArgs);
testMutationOperation(workerArgs);
testQueryOperation(browserArgs, { suppressWorkers: true });
testMutationOperation(browserArgs, { suppressWorkers: true });
