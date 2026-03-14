import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function UeberMichFAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Was ist dein Designprozess?</AccordionTrigger>
        <AccordionContent>Hier deine Antwort.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Arbeitest du remote?</AccordionTrigger>
        <AccordionContent>Ja, bevorzugt remote/hybrid.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
