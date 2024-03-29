import { Contact, ContactTemplate, PhoneNumberLabel } from "@clinq/bridge";
import { Category, CopperContact, CopperLead } from "./copper";

const toLabel = (category: Category) => {
  switch (category) {
    case "home":
    case "personal":
      return PhoneNumberLabel.HOME;
    case "work":
      return PhoneNumberLabel.WORK;
    case "mobile":
      return PhoneNumberLabel.MOBILE;
    default:
      return PhoneNumberLabel.WORK;
  }
};

const toCategory = (label: PhoneNumberLabel): Category => {
  switch (label) {
    case PhoneNumberLabel.HOME:
      return "home";
    case PhoneNumberLabel.WORK:
      return "work";
    case PhoneNumberLabel.MOBILE:
      return "mobile";
    default:
      return "other";
  }
};

export const toContact = (contact: CopperContact): Contact => ({
  id: String(contact.id),
  name: contact.name,
  firstName: contact.first_name,
  lastName: contact.last_name,
  organization: contact.company_name,
  email: contact.emails.length
    ? contact.emails.map((email) => email.email)[0]
    : null,
  phoneNumbers: contact.phone_numbers.map((phoneNumber) => ({
    label: toLabel(phoneNumber.category),
    phoneNumber: phoneNumber.number,
  })),
  avatarUrl: null,
  contactUrl: null,
});

export const leadToContact = (contact: CopperLead): Contact => {
  const email = contact.email ? contact.email.email : null;
  return {
    id: String(contact.id),
    name: contact.name,
    firstName: contact.first_name,
    lastName: contact.last_name,
    organization: contact.company_name,
    email,
    phoneNumbers: contact.phone_numbers.map((phoneNumber) => ({
      label: toLabel(phoneNumber.category),
      phoneNumber: phoneNumber.number,
    })),
    avatarUrl: null,
    contactUrl: null,
  };
};

const buildName = ({ name, firstName, lastName }: ContactTemplate) => {
  if (name) {
    return name;
  }

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return firstName || lastName || "";
};

export const toCopperContact = (contact: ContactTemplate): CopperContact => ({
  name: buildName(contact),
  first_name: contact.firstName || "",
  last_name: contact.lastName || "",
  company_name: contact.organization || "",
  emails: contact.email ? [{ email: contact.email, category: "work" }] : [],
  phone_numbers: contact.phoneNumbers.map((phoneNumber) => ({
    category: toCategory(phoneNumber.label),
    number: phoneNumber.phoneNumber,
  })),
});
