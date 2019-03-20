import {
  Adapter,
  Config,
  ContactTemplate,
  ContactUpdate,
  start
} from "@clinq/bridge";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact
} from "./copper";
import { toContact, toCopperContact } from "./mapper";

class CopperAdapter implements Adapter {
  public async getContacts(config: Config) {
    const copperContacts = await getContacts(config);
    return copperContacts.map(toContact);
  }

  public async createContact(config: Config, contact: ContactTemplate) {
    const copperContact = await createContact(config, toCopperContact(contact));
    return toContact(copperContact);
  }

  public async updateContact(
    config: Config,
    id: string,
    contact: ContactUpdate
  ) {
    const copperContact = await updateContact(
      config,
      id,
      toCopperContact(contact)
    );
    return toContact(copperContact);
  }

  public async deleteContact(config: Config, id: string) {
    return deleteContact(config, id);
  }
}

start(new CopperAdapter());
