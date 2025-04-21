import BundleDetailsClient from "./client";

export default async function BundleDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <BundleDetailsClient id={(await params).id} />;
}
