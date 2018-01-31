import testMutationOperation from "./mutation";
import testQueryOperation from "./query";
import testSubscriptionOperation from "./subscription";
import { browserArgs, subscriptionArgs, workerArgs } from "../../helpers";

testQueryOperation(workerArgs);
testMutationOperation(workerArgs);
// testSubscriptionOperation(subscriptionArgs);
testQueryOperation(browserArgs, { suppressWorkers: true });
testMutationOperation(browserArgs, { suppressWorkers: true });
testSubscriptionOperation(subscriptionArgs, { suppressWorkers: true });
