import { client } from "@/lib/rpc";

type Props = {
  params: { id: string };
};

export default async function SingleUniversityPage({ params }: Props) {
  const rpcClient = await client();

  const universityRes = await rpcClient.api.university[":id"].$get({
    param: { id: params.id },
  });

  const universityDetails = await universityRes.json();

  return (
    <div>
      <h2>University ID: {params.id}</h2>

      <h3>Details:</h3>
      <pre>{JSON.stringify(universityDetails, null, 2)}</pre>
    </div>
  );
}
