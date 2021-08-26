import { Config } from "@clinq/bridge";
import axios from "axios";

export type Category = "work" | "home" | "personal" | "mobile" | "other";

export interface Company {
  id: number;
  name: string;
}

export interface CopperEmail {
  email: string;
  category: Category;
}

export interface CopperContact {
  id?: number;
  name: string;
  first_name: string;
  last_name: string;
  company_id?: number;
  company_name: string;
  emails: CopperEmail[];
  phone_numbers: Array<{
    number: string;
    category: Category;
  }>;
}

export interface CopperLead {
  id?: number;
  name: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: CopperEmail;
  phone_numbers: Array<{
    number: string;
    category: Category;
  }>;
}

const PAGE_SIZE = 200;

const NO_OP = () => null;

const copper = ({ apiKey }: Config) => {
  const [email, key] = apiKey.split(":");
  return axios.create({
    baseURL: "https://api.prosperworks.com/developer_api/v1/",
    headers: {
      "X-PW-Application": "developer_api",
      "X-PW-AccessToken": key,
      "X-PW-UserEmail": email,
    },
  });
};

export const getContacts = async (
  config: Config,
  page = 1,
  accumulated: CopperContact[] = []
): Promise<CopperContact[]> => {
  const { data } = await copper(config).post<CopperContact[]>(
    "/people/search",
    {
      page_size: PAGE_SIZE,
      page_number: page,
    }
  );

  const contacts = [...accumulated, ...data];

  if (data.length === PAGE_SIZE) {
    return getContacts(config, page + 1, contacts);
  } else {
    return contacts;
  }
};

export const getLeads = async (
  config: Config,
  page = 1,
  accumulated: CopperLead[] = []
): Promise<CopperLead[]> => {
  const { data } = await copper(config).post<CopperLead[]>("/leads/search", {
    page_size: PAGE_SIZE,
    page_number: page,
  });

  const contacts = [...accumulated, ...data];

  if (data.length === PAGE_SIZE) {
    return getLeads(config, page + 1, contacts);
  } else {
    return contacts;
  }
};

export const createContact = async (config: Config, contact: CopperContact) => {
  const company = await getOrCreateCompany(config, contact.company_name);
  contact.company_id = company.id;

  try {
    const { data } = await copper(config).post<CopperContact>(
      "/people",
      contact
    );
    return data;
  } catch (error) {
    console.error(error.response.data);
    throw error;
  }
};

export const updateContact = async (
  config: Config,
  id: string,
  contact: CopperContact
) => {
  try {
    const [maybeContact, maybeLead] = await Promise.all([
      getContactById(config, id).catch(NO_OP),
      getLeadById(config, id).catch(NO_OP),
    ]);

    // contact IS a lead and NOT a contact
    if (maybeLead && !maybeContact) {
      throw new Error("Updating leads is not supported");
    }

    const company = await getOrCreateCompany(config, contact.company_name);
    contact.company_id = company.id;

    const { data } = await copper(config).put<CopperContact>(
      `/people/${id}`,
      contact
    );
    return data;
  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
    }
    throw error;
  }
};

export const getLeadById = async (config: Config, id: string) => {
  try {
    return await copper(config).get(`/leads/${id}`);
  } catch (error) {
    if (error.response.data.status === 404) {
      return null;
    }
    console.error(error.response.data);
    throw error;
  }
};

export const getContactById = async (config: Config, id: string) => {
  try {
    return await copper(config).get(`/people/${id}`);
  } catch (error) {
    if (error.response.data.status === 404) {
      return null;
    }
    console.error(error.response.data);
    throw error;
  }
};

export const deleteContact = async (config: Config, id: string) => {
  try {
    await copper(config).delete(`/people/${id}`);
  } catch (error) {
    console.error(error.response.data);
    throw error;
  }
};

const getOrCreateCompany = async (config: Config, name: string) => {
  const company = await getCompanyByName(config, name);
  return company ? company : createCompany(config, name);
};

const getCompanyByName = async (config: Config, name: string) => {
  try {
    const { data } = await copper(config).post<Company[]>("/companies/search", {
      name,
    });

    return data.length ? data[0] : null;
  } catch (error) {
    console.error(error.response.data);
    throw error;
  }
};

const createCompany = async (config: Config, name: string) => {
  try {
    const { data } = await copper(config).post<Company>("/companies", {
      name,
    });

    return data;
  } catch (error) {
    console.error(error.response.data);
    throw error;
  }
};
