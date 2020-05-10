import React, { Fragment, useContext } from "react";
import ContactContext from "../../context/contact/contactContext";
import { ContactItem } from "../contacts/ContactItem";
export const Contacts = () => {
  const contactContext = useContext(ContactContext); // now have access to any state and action associated with this context
  const { contacts } = contactContext;
  return (
    <Fragment>
      {contacts.map((contact) => (
        <ContactItem key={contact.id} contact={contact} />
      ))}
    </Fragment>
  );
};
