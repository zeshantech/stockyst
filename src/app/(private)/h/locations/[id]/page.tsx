import LocationDetailsClient from "@/components/(private)/dashboard/locations/LocationDetailsClient";

// src/app/(private)/h/locations/[id]/page.tsx
export default async function LocationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <LocationDetailsClient id={id} />;
}
