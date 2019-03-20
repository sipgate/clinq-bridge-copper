import { Config } from "@clinq/bridge";
import axios from "axios";

export type Category = "work" | "home" | "personal" | "mobile" | "other";

export interface CopperContact {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  company_name: string;
  emails: Array<{ email: string; category: Category }>;
  phone_numbers: Array<{
    number: string;
    category: Category;
  }>;
}

const PAGE_SIZE = 200;

const copper = ({ apiKey }: Config) => {
  const [email, key] = apiKey.split(":");
  return axios.create({
    baseURL: "https://api.prosperworks.com/developer_api/v1/",
    headers: {
      "X-PW-Application": "developer_api",
      "X-PW-AccessToken": key,
      "X-PW-UserEmail": email
    }
  });
};

export const getContacts = async (
  config: Config,
  page: number = 1,
  accumulated: CopperContact[] = []
): Promise<CopperContact[]> => {
  const { data } = await copper(config).post<CopperContact[]>(
    "/people/search",
    {
      page_size: PAGE_SIZE,
      page_number: page
    }
  );

  const contacts = [...accumulated, ...data];

  if (data.length === PAGE_SIZE) {
    return getContacts(config, page + 1, contacts);
  } else {
    return contacts;
  }
};
