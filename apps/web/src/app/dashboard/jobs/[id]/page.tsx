import { client } from "@/lib/rpc";

type Props = {
  params: { id: string };
};

export default async function SingleJobsPage({ params }: Props) {
  const rpcClient = await client();

  const jobsRes = await rpcClient.api.jobs[":id"].$get({
    param: { id: params.id },
  });

  const jobsDetails = await jobsRes.json();

  return (
    <div>
      <h2>Jobs ID: {params.id}</h2>

      <h3>Details:</h3>
      <pre>{JSON.stringify(jobsDetails, null, 2)}</pre>
    </div>
  );
}
