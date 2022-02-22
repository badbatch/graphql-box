import { useContext } from "react";
import { Context } from "../../contexts/GraphQLBox";

export default () => useContext(Context).graphqlBoxClient;
