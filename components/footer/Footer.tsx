import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <div>
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
      </div>
      <div>
        <p>© 2025 Midnight Code LLC. All rights reserved.</p>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>FAQ</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p className="italic">What services do we offer?</p>
            <p>Web Development, Website development, Application Development</p>
            <p className="italic">How can you contact us?</p>
            <p>
              You can reach us via the contact form on our website or email us
              at <>contact@midnight-code.tech</> and we will get back to you as
              soon as possible.
            </p>
            <p className="italic">What is your pricing model?</p>
            <p>
              Our pricing varies based on the project scope and requirements.
              <Link href="/contact">Contact</Link> us for a detailed quote.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </footer>
  );
}
