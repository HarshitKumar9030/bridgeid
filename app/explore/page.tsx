import connectToDatabase from "@/lib/mongodb";
import Identity from "@/models/Identity";
import { ExploreGrid } from "@/components/ExploreGrid";

export const revalidate = 60; // Cache this page for 60 seconds

export default async function ExplorePage() {
  await connectToDatabase();

  // Fetch the top 50 trusted identities for the public directory
  const identities = await Identity.find({})
    .sort({ trustScore: -1, createdAt: -1 })
    .limit(50)
    .lean();

  // Serialize to pure JSON objects to pass to Client Component safely
  const serializedIdentities = identities.map((doc) => ({
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString()
  }));

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 md:pt-32 pb-24 px-6 sm:px-12 selection:bg-primary/30 z-10 w-full overflow-x-hidden relative">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <section className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1] text-foreground">
            Public <span className="font-serif italic text-primary">Directory.</span>
          </h1>
          <p className="text-muted-foreground mt-6 text-xl leading-relaxed text-balance">
            Explore and endorse active trust profiles from the network.
            NGOs, employers, and authorized peers can add community confirmations directly here to bump visibility.
          </p>
        </section>

        {/* Client component for searching and handling the Verify actions */}
        <ExploreGrid initialIdentities={serializedIdentities} />
      </div>
    </div>
  );
}
