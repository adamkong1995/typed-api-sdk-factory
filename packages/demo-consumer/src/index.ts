import {
  createApiAClient,
  getHealth,
  getCustomersByCustomerId,
  postCustomersSearch,
} from "@demo/sdk-a";

const baseURL = process.env.API_A_BASE_URL ?? "http://localhost:4011";

async function main() {
  console.log("[demo-consumer] API A:", baseURL);

  const client = createApiAClient({ baseURL });
  const options = await client.options();
  console.log("options:", options);
  // 1) Health
  const health = await getHealth(options);
  console.log("health:", health.data);

  // 2) Get customer by id
  const customer = await getCustomersByCustomerId({
    path: { customerId: "c_1001" },
    baseUrl: baseURL,
  });
  console.log("customer:", customer.data);

  // 3) Search customers
  const search = await postCustomersSearch({
    body: { query: "alex", limit: 10 },
    baseUrl: baseURL,
  });
  console.log(
    "search.results:",
    search?.data?.results.map((c) => c.customerId),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
