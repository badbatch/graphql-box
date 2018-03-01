import testImportExportMethods from "./import-export";
import testMutationOperation from "./mutation";
import testQueryOperation from "./query";
import testSubscriptionOperation from "./subscription";
import { browserClientArgs, subscriptionClientArgs, workerClientArgs } from "../../helpers";

testQueryOperation(workerClientArgs);
testMutationOperation(workerClientArgs);
testSubscriptionOperation(subscriptionClientArgs);
testImportExportMethods(workerClientArgs);
testQueryOperation(browserClientArgs, { suppressWorkers: true });
testMutationOperation(browserClientArgs, { suppressWorkers: true });
testSubscriptionOperation(subscriptionClientArgs, { suppressWorkers: true });
testImportExportMethods(browserClientArgs, { suppressWorkers: true });
