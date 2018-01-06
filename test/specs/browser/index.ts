import testQueryOperation from "./query";
import { browserArgs, workerArgs } from "../../helpers";

testQueryOperation(workerArgs);
testQueryOperation(browserArgs, { suppressWorkers: true });
