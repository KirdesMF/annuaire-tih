import { LinkIcon, Loader, MapPinIcon, Search } from "lucide-react";
import { Separator } from "radix-ui";
import { Input } from "~/components/ui/input";

export function HeroCard() {
  return (
    <div className="bg-card text-card-foreground rounded-lg ring-1 ring-border shadow-md w-full">
      <div className="px-6 py-4 border-b border-border flex items-center relative">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-red-500" />
          <div className="size-2.5 rounded-full bg-yellow-500" />
          <div className="size-2.5 rounded-full bg-green-500" />
        </div>

        <div className="border-muted border text-muted-foreground px-6 py-1 rounded-sm absolute top-1/2 -translate-y-1/2 -translate-x-1/2 start-1/2 flex items-center gap-2">
          <LinkIcon className="size-3" />
          <p className="text-xs font-medium text-nowrap">https://annuaire-tih.fr</p>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="size-4 absolute top-2.5 start-2 text-muted-foreground" />
            <Input className="w-full ps-8" placeholder="annuaire tih" readOnly disabled />
            <Loader className="size-4 absolute top-2.5 end-2 text-muted-foreground animate-spin" />
          </div>

          <ul className="flex items-center gap-2">
            <li className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-sm w-fit">
              Santé et social
            </li>
            <li className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-sm w-fit">
              Services à la personne
            </li>
          </ul>
        </div>

        <Separator.Root className="h-px bg-border my-6" />

        <div className="mt-4 grid gap-2">
          <div className="shadow-xs bg-card text-card-foreground p-4 ring-1 ring-border rounded-sm flex items-center gap-3">
            <div className="size-8 rounded-full bg-muted flex items-center justify-center">
              <MapPinIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">Services Adaptés</h3>
              <p className="text-xs text-muted-foreground">Lyon, France</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-14 h-1.5 bg-muted rounded-full animate-pulse" />
              <div className="w-16 h-1.5 bg-muted rounded-full animate-pulse" />
              <div className="w-10 h-1.5 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
          <div className="shadow-xs bg-card text-card-foreground p-4 ring-1 ring-border rounded-sm flex items-center gap-3">
            <div className="size-8 rounded-full bg-muted flex items-center justify-center">
              <MapPinIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">Accessibilité Plus</h3>
              <p className="text-xs text-muted-foreground">Marseille, France</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-12 h-1.5 bg-muted rounded-full animate-pulse" />
              <div className="w-16 h-1.5 bg-muted rounded-full animate-pulse" />
              <div className="w-14 h-1.5 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            disabled
            className="text-xs border-primary border rounded-sm px-2 py-1 text-primary"
          >
            Ajouter mon entreprise
          </button>
        </div>
      </div>
    </div>
  );
}
