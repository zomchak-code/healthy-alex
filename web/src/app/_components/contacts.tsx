"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function Contacts({ name }: { name: string }) {
  const [contacts] = api.people.findContacts.useSuspenseQuery({ name });

  const [copied, setCopied] = useState('');

  const timeout = useRef<NodeJS.Timeout>(null);

  const handleCopy = (email: string) => {
    void navigator.clipboard.writeText(email);
    setCopied(email);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      {contacts.length === 0 && <div className="text-sm text-muted-foreground">No emails found</div>}
      {contacts.map((contact) => (
        <Button onClick={() => handleCopy(contact.email)} key={contact.email} variant="secondary" className="group h-auto text-left items-start justify-between px-3 whitespace-normal">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Mail />
              <span >{contact.email}</span>
            </div>
            <div className="font-normal">
              {contact.name}
            </div>
            <div className="font-normal ">
              {contact.university}
            </div>
          </div>
          <div className="invisible group-hover:visible py-1">
            {copied === contact.email ? <Check /> : <Copy />}
          </div>
        </Button>
      ))}
    </div>
  );
}
