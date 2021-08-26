import {
  Adapter,
  Config,
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
    const [copperContacts, copperLeads] = await Promise.all([
      getContacts(config),
      getLeads(config),
    ]);
    const mappedContacts = copperContacts.map(toContact);
    const mappedLeads = copperLeads.map(leadToContact);
    return [...mappedContacts, ...mappedLeads];
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
