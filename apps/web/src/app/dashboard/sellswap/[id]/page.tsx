import { client } from "@/lib/rpc";

type Props = {
  params: { id: string };
};

export default async function SingleSellSwapsPage({ params }: Props) {
  const rpcClient = await client();

  const sellSwapRes = await rpcClient.api.sellswaps[":id"].$get({
    param: { id: params.id },
  });

  const sellSwapsDetails = await sellSwapRes.json();

  return (
    <div>
      <h2>SellSwaps ID: {params.id}</h2>

      <h3>Details:</h3>
      <pre>{JSON.stringify(sellSwapsDetails, null, 2)}</pre>
    </div>
  );
}
