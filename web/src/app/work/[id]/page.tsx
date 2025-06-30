"use client";

import { ExternalLink, Scroll, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";

function WorkContent() {
    const { id } = useParams();
    const [work] = api.works.get.useSuspenseQuery({ id: id as string });

    return (
        <div className="overflow-y-auto relative h-full">
            <div className="p-4 flex flex-wrap gap-2 items-center sticky top-0 bg-background/70 backdrop-blur-md">
                <p className="text-lg flex gap-2 items-center">{work.title}</p>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary"><Scroll /> Work</Badge>
                    <Badge variant="secondary">Publication date: {work.publication_date}</Badge>
                    <Badge variant="secondary">{work.cited_by_count} citations</Badge>
                    <Button variant="secondary" asChild>
                        <Link href={work.primary_location.landing_page_url} target="_blank"><ExternalLink /> Open original</Link>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <p className="px-4">Authors</p>
                <div className="px-4 pb-4 overflow-y-auto grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {work.authorships.map((authorship) => (
                        <Button asChild key={authorship.author.id} variant="secondary" className="h-auto w-full flex-col justify-start items-start text-left whitespace-normal">
                            <Link href={`/person/${authorship.author.id}`}>
                                <span className="flex items-center gap-1">
                                    <User /> {authorship.author.display_name}
                                </span>
                                <div className="font-normal">
                                    {authorship.institutions.map((institution) => (
                                        <div key={institution.id} >{institution.display_name}</div>
                                    ))}
                                </div>
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const { id } = useParams();

    return (
        <Suspense
            key={id as string}
            fallback={
                <div className="overflow-y-auto relative h-full">
                    <div className="p-4 flex flex-wrap gap-2 items-center sticky top-0 bg-background/70 backdrop-blur-md">
                        <Skeleton className="h-6 w-96" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-16 mx-4" />
                        <div className="px-4 pb-4 overflow-y-auto grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <Skeleton key={index} className="h-20 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            }
        >
            <WorkContent />
        </Suspense>
    );
}
