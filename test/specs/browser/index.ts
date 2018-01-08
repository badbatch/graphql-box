import testMutationOperation from "./mutation";
import testQueryOperation from "./query";
import { browserArgs, workerArgs } from "../../helpers";

testQueryOperation(workerArgs);
testQueryOperation(browserArgs, { suppressWorkers: true });
testMutationOperation(workerArgs);
testMutationOperation(browserArgs, { suppressWorkers: true });
