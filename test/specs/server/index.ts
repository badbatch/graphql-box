import { serverClientArgs, subscriptionClientArgs } from "../../helpers";
import testImportExportMethods from "./import-export";
import testMutationOperation from "./mutation";
import testQueryOperation from "./query";
import testSubscriptionOperation from "./subscription";

testQueryOperation(serverClientArgs);
testMutationOperation(serverClientArgs);
testSubscriptionOperation(subscriptionClientArgs);
testImportExportMethods(serverClientArgs);
