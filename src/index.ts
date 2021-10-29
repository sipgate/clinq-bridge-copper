import {
  Adapter,
  Config,
  Contact,
  ContactTemplate,
  ContactUpdate,
  start,
} from "@clinq/bridge";
import {
  createContact,
  deleteContact,
  getContacts,
  getLeads,
  updateContact,
} from "./copper";
import { leadToContact, toContact, toCopperContact } from "./mapper";

class CopperAdapter implements Adapter {
  public async getContacts(config: Config) {
    let contacts: Contact[] = [];
    try {
      const copperContacts = await getContacts(config);
      contacts = copperContacts.map(toContact);
    } catch (ignored) {}

    try {
      const copperLeads = await getLeads(config);
      contacts = contacts.concat(copperLeads.map(leadToContact));
    } catch (ignored) {}
    return contacts;
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
