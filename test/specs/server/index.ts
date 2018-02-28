import { serverArgs, subscriptionArgs } from "../../helpers";
import testImportExportMethods from "./import-export";
import testMutationOperation from "./mutation";
import testQueryOperation from "./query";
import testSubscriptionOperation from "./subscription";

testQueryOperation(serverArgs);
testMutationOperation(serverArgs);
testSubscriptionOperation(subscriptionArgs);
testImportExportMethods(serverArgs);
