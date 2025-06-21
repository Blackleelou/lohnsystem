// src/components/ui/dialog.tsx
import * as React from 'react';
import { Dialog as HIDialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Transition show={open} as={React.Fragment}>
      <HIDialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={onOpenChange}
      >
        <Transition.Child
          as={React.Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        <Transition.Child
          as={React.Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <HIDialog.Panel className="w-full max-w-md rounded-2xl bg-lohn-cardLight dark:bg-lohn-cardDark p-8 shadow-lg space-y-6">
            {/* Close-Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 rounded-full p-2 hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
            {children}
          </HIDialog.Panel>
        </Transition.Child>
      </HIDialog>
    </Transition>
  );
}

/* — optionale Convenience-Re-Exports, damit deine Importe passen — */
export const DialogContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const DialogHeader = ({ children }: { children: React.ReactNode }) => <div className="space-y-2">{children}</div>;
export const DialogTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-2xl font-semibold">{children}</h2>;
