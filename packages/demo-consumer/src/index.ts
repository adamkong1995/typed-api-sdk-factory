import {
  createApiAClient,
  getHealth as getHealthA,
  getCustomersByCustomerId,
  postCustomersSearch,
} from "@adamkong1995/sdk-a";

import {
  createApiBClient,
  getHealth as getHealthB,
  getCustomersByCustomerIdChequingAccounts,
  getChequingAccountsByAccountIdTransactions,
} from "@adamkong1995/sdk-b";

import { waitForHealth } from "./utils.js";

const apiABaseURL = process.env.API_A_BASE_URL ?? "http://localhost:4011";
const apiBBaseURL = process.env.API_B_BASE_URL ?? "http://localhost:4012";

async function main() {
  console.log("[demo-consumer] API A:", apiABaseURL);
  console.log("[demo-consumer] API B:", apiBBaseURL);

  const apiA = createApiAClient({ baseURL: apiABaseURL });
  const apiB = createApiBClient({ baseURL: apiBBaseURL });

  const optionsA = await apiA.options();
  const optionsB = await apiB.options();

  // --- API A calls (Profile Service) ---
  const healthA = await getHealthA(optionsA);
  console.log("A.health:", healthA.data);

  const customer = await getCustomersByCustomerId({
    path: { customerId: "c_1001" },
    baseUrl: apiABaseURL,
  });
  console.log(
    "A.customer:",
    customer.data?.customerId,
    customer.data?.fullName,
  );

  const search = await postCustomersSearch({
    body: { query: "alex", limit: 10 },
    baseUrl: apiABaseURL,
  });
  console.log("A.search.count:", search.data?.results.length);

  // --- API B: Chequing service ---
  const healthB = await getHealthB(optionsB);
  console.log("B.health:", healthB.data);

  const accounts = await getCustomersByCustomerIdChequingAccounts({
    path: { customerId: "c_1001" },
    baseUrl: apiBBaseURL,
  });
  const accountIds = accounts.data?.accounts.map((a) => a.accountId);
  console.log("B.accounts:", accountIds);

  // Grab first account and fetch 2 transactions
  const accountId = accountIds?.[0];
  if (!accountId) {
    console.log("B.tx: no accounts found for customer");
    return;
  }

  const txPage1 = await getChequingAccountsByAccountIdTransactions({
    path: { accountId }, // cursor optional
    query: { limit: 2 },
    baseUrl: apiBBaseURL,
  });
  console.log(
    "B.tx.page1:",
    txPage1.data?.transactions.map(
      (t) =>
        `${t.type}:${t.amount.amount} ${t.amount.currency} (${t.description})`,
    ),
  );

  // If nextCursor exists, fetch page 2
  if (txPage1.data?.nextCursor) {
    const txPage2 = await getChequingAccountsByAccountIdTransactions({
      path: { accountId },
      query: { limit: 2, cursor: txPage1.data.nextCursor },
      baseUrl: apiBBaseURL,
    });
    console.log(
      "B.tx.page2:",
      txPage2.data?.transactions.map(
        (t) =>
          `${t.type}:${t.amount.amount} ${t.amount.currency} (${t.description})`,
      ),
    );
  }
}

// Wait for both APIs to be healthy (for demo purposes)
console.log("[demo-consumer] Waiting for APIs to be healthy...");
await Promise.all([waitForHealth(apiABaseURL), waitForHealth(apiBBaseURL)]);

console.log("[demo-consumer] APIs are up, starting calls...");

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
