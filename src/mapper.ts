import { Contact, PhoneNumberLabel } from "@clinq/bridge";
import { Category, CopperContact } from "./copper";

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

export const toContact = (contact: CopperContact): Contact => ({
  id: String(contact.id),
  name: contact.name,
  firstName: contact.first_name,
  lastName: contact.last_name,
  organization: contact.company_name,
  email: contact.emails.length
    ? contact.emails.map(email => email.email)[0]
    : null,
  phoneNumbers: contact.phone_numbers.map(phoneNumber => ({
    label: toLabel(phoneNumber.category),
    phoneNumber: phoneNumber.number
  })),
  avatarUrl: null,
  contactUrl: null
});
