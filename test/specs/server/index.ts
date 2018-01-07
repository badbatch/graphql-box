import { serverArgs } from "../../helpers";
import testMutationOperation from "./mutation";
import testQueryOperation from "./query";

testQueryOperation(serverArgs);
testMutationOperation(serverArgs);
