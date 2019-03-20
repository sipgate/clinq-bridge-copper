import { Adapter, Config, start } from "@clinq/bridge";
import { getContacts } from "./copper";
import { toContact } from "./mapper";

class CopperAdapter implements Adapter {
  public async getContacts(config: Config) {
    const copperContacts = await getContacts(config);
    return copperContacts.map(toContact);
  }
}

start(new CopperAdapter());
