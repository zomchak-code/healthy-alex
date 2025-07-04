"use client"

import { User, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

function Loader() {
  return (
    <div className="space-y-1">
      <Skeleton className="h-4" />
      <Skeleton className="h-4" />
      <Skeleton className="h-4" />
    </div>
  );
}

const DEFAULT_DOMAIN_ID = '4';

interface FieldSelectorProps {
  value: string | null;
  onValueChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  label: string;
  isLoading: boolean;
  data?: { id: string, display_name: string }[];
  disabled?: boolean;
  tooltipText?: string;
}

function FieldSelector({
  value,
  onValueChange,
  onClear,
  placeholder,
  label,
  isLoading,
  data,
  disabled = false,
  tooltipText
}: FieldSelectorProps) {
  const content = (
    <div className="flex items-center gap-1">
      <Select value={value ?? ''} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="border-none shadow-none bg-secondary">
          {value && isLoading
            ? <Skeleton className="w-24 h-4" />
            : <SelectValue placeholder={placeholder} />
          }
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {isLoading ?
              <Loader /> :
              <>
                {data?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.display_name}</SelectItem>
                ))}
              </>
            }
          </SelectGroup>
        </SelectContent>
      </Select>
      {value && (
        <Button onClick={onClear} variant="ghost" className={"size-auto !p-0.5"} >
          <X />
        </Button>
      )}
    </div>
  );

  if (tooltipText && disabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {content}
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}

export default function Home() {
  const [fieldId, setFieldId] = useQueryState("field");
  const [subfieldId, setSubfieldId] = useQueryState("subfield");
  const [topicId, setTopicId] = useQueryState("topic");

  let type = 'primary_topic';
  let id: string;

  if (topicId) {
    id = topicId;
  } else if (subfieldId) {
    type += '.subfield';
    id = subfieldId;
  } else if (fieldId) {
    type += '.field';
    id = fieldId;
  } else {
    type += '.domain';
    id = DEFAULT_DOMAIN_ID;
  }

  const getDomain = api.topics.getDomain.useQuery();
  const getField = api.topics.getField.useQuery(fieldId!, {
    enabled: !!fieldId,
  });
  const getSubfield = api.topics.getSubfield.useQuery(subfieldId!, {
    enabled: !!subfieldId,
  });

  const getPeople = api.people.getAll.useQuery({ type, id });

  function setTopic({ fieldId, subfieldId }: {
    fieldId?: string | null, subfieldId?: string | null
  }) {
    void setTopicId(null);
    void setSubfieldId(null);
    if (fieldId !== undefined) {
      void setFieldId(fieldId);
    }
    if (subfieldId) {
      void setSubfieldId(subfieldId);
    }
  }

  return (
    <div className="relative overflow-y-auto h-full flex flex-col">
      <div className="p-4 flex flex-wrap items-center gap-3 sticky top-0 bg-background/70 backdrop-blur-md">
        <p>Top health researchers in</p>
        <div className="flex flex-wrap items-center gap-3">
          <FieldSelector
            value={fieldId}
            onValueChange={(value) => setTopic({ fieldId: value })}
            onClear={() => setTopic({ fieldId: null })}
            placeholder="Field"
            label="Fields"
            isLoading={getDomain.isLoading}
            data={getDomain.data?.fields}
          />
          <FieldSelector
            value={subfieldId}
            onValueChange={(value) => setTopic({ subfieldId: value })}
            onClear={() => setTopic({ subfieldId: null })}
            placeholder="Subfield"
            label="Subfields"
            isLoading={getField.isLoading}
            data={getField.data?.subfields}
            disabled={!fieldId}
            tooltipText="Select a field first"
          />
          <FieldSelector
            value={topicId}
            onValueChange={(value) => setTopicId(value)}
            onClear={() => setTopicId(null)}
            placeholder="Topic"
            label="Topics"
            isLoading={getSubfield.isLoading}
            data={getSubfield.data?.topics}
            disabled={!subfieldId}
            tooltipText="Select a subfield first"
          />
        </div>
      </div>
      <div className="px-4 pb-4 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" >
        {
          getPeople.isLoading ?
            <>
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </>
            :
            <>
              {
                getPeople.data?.map((author) => (
                  <Button asChild key={author.id} variant="secondary" className="h-auto w-full flex-col justify-between items-start text-left whitespace-normal">
                    <Link href={`/person/${author.id}`}>
                      <div className="space-y-1">
                        <span className="flex items-center gap-1">
                          <User /> {author.display_name}
                        </span>
                        <div className="text-xs font-normal">
                          {author.institutions.map((institution) => (
                            <div key={institution.id} >{institution.display_name}</div>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs font-normal">Detected citations: {author.total_citations}</div>
                    </Link>
                  </Button>
                ))
              }
            </>
        }
      </div>
    </div>
  );
}