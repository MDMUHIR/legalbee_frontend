import React, { useState } from 'react';
import { AlertTriangle, X, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface EmergencyContact {
  label: string;
  number: string;
  link?: string;
}

const emergencyContacts: EmergencyContact[] = [
  { 
    label: "ন্যাশনাল ইমার্জেন্সি সার্ভিস", 
    number: "999", 
    link: "https://nhd.gov.bd/" 
  },
  { 
    label: "৩৩৩ কল সেন্টার", 
    number: "333" 
  },
  { 
    label: "অ্যাম্বুলেন্স সার্ভিস", 
    number: "16263", 
    link: "http://16263.dghs.gov.bd/ambulance/" 
  },
  { 
    label: "নারী ও শিশু নির্যাতন প্রতিরোধ", 
    number: "109", 
    link: "https://mowca.gov.bd/" 
  },
  { 
    label: "জাতীয় মানবাধিকার কমিশন", 
    number: "16108", 
    link: "http://www.nhrc.org.bd/" 
  },
  { 
    label: "দুর্নীতি দমন কমিশন", 
    number: "106", 
    link: "http://acc.org.bd/" 
  }
];

interface EmergencyButtonProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmergencyButton = ({ isOpen, onOpenChange }: EmergencyButtonProps) => {
  const isMobile = useIsMobile();

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Emergency Modal - Desktop */}
      {!isMobile && (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-sm sm:max-w-md mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%] sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-sm sm:text-base lg:text-lg font-semibold text-emergency flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-center sm:text-left">জরুরী সেবার হটলাইন নাম্বার</span>
            </DialogTitle>
          </DialogHeader>

           <div className="space-y-2 sm:space-y-3 mt-2">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="border-emergency/20">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm sm:text-base leading-tight mb-1">{contact.label}</h3>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-emergency">
                        {contact.number}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        onClick={() => handleCall(contact.number)}
                        className="flex-1 sm:flex-none bg-emergency hover:bg-emergency/90 text-emergency-foreground h-10 sm:h-9 px-4 sm:px-3 text-sm font-medium"
                      >
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        Call
                      </Button>

                      {contact.link && (
                        <Button
                          onClick={() => handleWebsite(contact.link!)}
                          variant="outline"
                          size="icon"
                          className="border-emergency/20 text-emergency hover:bg-emergency/5 h-10 sm:h-9 w-10 sm:w-9 flex-shrink-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 sm:mt-6 p-3 bg-warning rounded-lg">
            <p className="text-xs sm:text-sm text-warning-foreground">
              <strong>বিশেষ দ্রষ্টব্য:</strong> এই নম্বরগুলো শুধুমাত্র জরুরী অবস্থায় ব্যবহার করুন।
              অপ্রয়োজনীয় কল থেকে বিরত থাকুন।
            </p>
          </div>

          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full mt-4 h-11 sm:h-10 text-sm sm:text-base"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogContent>
      </Dialog>
      )}

      {/* Emergency Sheet - Mobile */}
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
            <SheetHeader className="pb-2">
              <SheetTitle className="text-base font-semibold text-emergency flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                জরুরী সেবার হটলাইন নাম্বার
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-3 mt-2">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="border-emergency/20">
                  <CardContent className="p-3">
                    <div className="flex flex-col gap-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm leading-tight mb-1">{contact.label}</h3>
                        <p className="text-lg font-bold text-emergency">
                          {contact.number}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          onClick={() => handleCall(contact.number)}
                          className="flex-1 bg-emergency hover:bg-emergency/90 text-emergency-foreground h-10 px-4 text-sm font-medium"
                        >
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          Call
                        </Button>

                        {contact.link && (
                          <Button
                            onClick={() => handleWebsite(contact.link!)}
                            variant="outline"
                            size="icon"
                            className="border-emergency/20 text-emergency hover:bg-emergency/5 h-10 w-10 flex-shrink-0"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4 p-3 bg-warning rounded-lg">
              <p className="text-xs text-warning-foreground">
                <strong>বিশেষ দ্রষ্টব্য:</strong> এই নম্বরগুলো শুধুমাত্র জরুরী অবস্থায় ব্যবহার করুন।
                অপ্রয়োজনীয় কল থেকে বিরত থাকুন।
              </p>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
