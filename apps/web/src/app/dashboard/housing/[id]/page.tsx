import { client } from "@/lib/rpc";

type Props = {
  params: { id: string };
};

export default async function SingleHousingPage({ params }: Props) {
  const rpcClient = await client();

  const housingRes = await rpcClient.api.housing[":id"].$get({
    param: { id: params.id }
  });

  const housingDetails = await housingRes.json();

  return (
    <div>
      <h2>Housing ID: {params.id}</h2>

      <h3>Details:</h3>
      <pre>{JSON.stringify(housingDetails, null, 2)}</pre>
    </div>
  );
}
