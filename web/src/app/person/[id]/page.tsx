"use client";

import { Building, CircleQuestionMark, ExternalLink, Scroll, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Contacts } from "~/app/_components/contacts";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip"
import { Badge } from "~/components/ui/badge";
import { useParams } from "next/navigation";

function PersonContent() {
    const { id } = useParams();
    const [person] = api.people.get.useSuspenseQuery({ id: id as string });

    return (
        <div className="h-full flex flex-col gap-2">
            <div className="p-4 flex flex-wrap gap-4 items-center">
                <p className="flex gap-2">{person.display_name}</p>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary"><User /> Author</Badge>
                    {person.last_known_institutions.map((institution) => (
                        <Badge variant="secondary" key={institution.id}> <Building /> {institution.display_name}</Badge>
                    ))}
                    <Badge variant="secondary">{person.cited_by_count} citations</Badge>
                    <Badge variant="secondary">{person.works_count} works</Badge>
                    <Button variant="secondary" asChild>
                        <Link href={`https://google.com/search?q=${person.display_name} ${person.last_known_institutions[0]?.display_name}`} target="_blank">
                            <ExternalLink /> Google search
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="min-h-0 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                <div className="px-4 space-y-1">
                    <p className="flex items-center gap-2">

                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2">Discovered emails <CircleQuestionMark size={20} /></TooltipTrigger>
                            <TooltipContent>
                                We try to find publicly available emails for this person.<br />
                                They are <strong>not guaranteed to be correct</strong>.
                            </TooltipContent>
                        </Tooltip>
                    </p>
                    <Suspense fallback={
                        <div className="space-y-2">
                            <Skeleton className="w-full h-20" />
                            <Skeleton className="w-full h-20" />
                            <Skeleton className="w-full h-20" />
                        </div>}>
                        <Contacts name={person.display_name} />
                    </Suspense>
                </div>
                <div className="space-y-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4 flex flex-col min-h-0">
                    <p>Top Works</p>
                    <div className="pr-4 pb-4 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                        {person.works.map((work) => (
                            <Button key={work.id} variant="secondary" asChild className="h-auto w-full flex-col justify-between items-start text-left whitespace-normal">
                                <Link href={`/work/${work.id}`}>
                                    <div className="space-y-1">
                                        <div><Scroll className="inline mb-0.5 mr-0.5" /> {work.title}</div>
                                        <div className="font-normal text-muted-foreground">
                                            {work.authorships.slice(0, 16).map((author) => author.author.display_name).join(", ")}
                                            {work.authorships.length > 16 &&
                                                <span className="text-muted-foreground">, {work.authorships.length - 16} more authors...</span>}
                                        </div>
                                    </div>
                                    <span className="font-normal text-muted-foreground">{work.publication_year} · {work.cited_by_count} citations</span>
                                </Link>
                            </Button>
                        ))}
                    </div>
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
                <div className="h-full flex flex-col gap-2">
                    <div className="p-4 flex flex-wrap gap-4 items-center">
                        <Skeleton className="h-6 w-48" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                    <div className="min-h-0 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        <div className="px-4 space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <div className="space-y-2">
                                <Skeleton className="w-full h-10" />
                                <Skeleton className="w-full h-10" />
                                <Skeleton className="w-full h-10" />
                            </div>
                        </div>
                        <div className="space-y-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4 flex flex-col min-h-0">
                            <Skeleton className="h-4 w-20" />
                            <div className="pr-4 pb-4 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <Skeleton key={index} className="h-20 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <PersonContent />
        </Suspense>
    );
}
