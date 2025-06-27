import { client } from "@/lib/rpc";

type Props = {
  params: { id: string };
};

export default async function SingleProductPage({ params }: Props) {
  const rpcClient = await client();

  const productRes = await rpcClient.api.products[":id"].$get({
    param: { id: params.id },
  });

  const productDetails = await productRes.json();

  return (
    <div>
      <h2>Product ID: {params.id}</h2>

      <h3>Details:</h3>
      <pre>{JSON.stringify(productDetails, null, 2)}</pre>
    </div>
  );
}
