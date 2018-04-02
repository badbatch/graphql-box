import * as EventEmitter from "eventemitter3";
import logger from "../../logger";
import { ObjectMap } from "../../types";

class HandlDebugger extends EventEmitter {
  public emit(event: string, props: ObjectMap): boolean {
    const hasListeners = super.emit(event, props);
    logger.debug(event, props);
    return hasListeners;
  }
}

export default new HandlDebugger();
