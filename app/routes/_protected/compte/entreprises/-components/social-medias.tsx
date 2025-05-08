import { CircleMinusIcon, CirclePlusIcon, GlobeIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { CalendlyIcon } from "~/components/icons/calendly";
import { FacebookIcon } from "~/components/icons/facebook";
import { InstagramIcon } from "~/components/icons/instagram";
import { LinkedinIcon } from "~/components/icons/linkedin";
import { SpotifyIcon } from "~/components/icons/spotify";
import { TiktokIcon } from "~/components/icons/tiktok";
import { TwitterIcon } from "~/components/icons/twitter";
import { YoutubeIcon } from "~/components/icons/youtube";
import { Input } from "~/components/ui/input";
import { Select, SelectItem } from "~/components/ui/select";
import { useToast } from "~/components/ui/toast";
import type { Company } from "~/db/schema/companies";

const SOCIAL_MEDIAS = [
  { name: "facebook", placeholder: "https://www.facebook.com/monentreprise", icon: FacebookIcon },
  {
    name: "instagram",
    placeholder: "https://www.instagram.com/monentreprise",
    icon: InstagramIcon,
  },
  {
    name: "linkedin",
    placeholder: "https://www.linkedin.com/company/monentreprise",
    icon: LinkedinIcon,
  },
  { name: "calendly", placeholder: "https://calendly.com/monentreprise", icon: CalendlyIcon },
  { name: "youtube", placeholder: "https://www.youtube.com/monentreprise", icon: YoutubeIcon },
  { name: "tiktok", placeholder: "https://www.tiktok.com/monentreprise", icon: TiktokIcon },
  { name: "twitter", placeholder: "https://www.twitter.com/monentreprise", icon: TwitterIcon },
  { name: "spotify", placeholder: "https://www.spotify.com/monentreprise", icon: SpotifyIcon },
] as const;

type SocialMediaName = (typeof SOCIAL_MEDIAS)[number]["name"];

interface SocialMedia {
  name: SocialMediaName;
  url: string;
}

function Icon({ name }: { name: SocialMediaName }) {
  const Icon = SOCIAL_MEDIAS.find((socialMedia) => socialMedia.name === name)?.icon || GlobeIcon;
  return <Icon className="size-4 text-muted-foreground absolute start-2 top-2.5" />;
}

export function SocialMedias({ company }: { company?: Company }) {
  const { toast } = useToast();
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>(
    company?.social_media
      ? Object.entries(company.social_media).map(([key, value]) => ({
          name: key as SocialMediaName,
          url: value,
        }))
      : [],
  );
  const [selectedNetwork, setSelectedNetwork] = useState<SocialMediaName | "">("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddSocialMedia = useCallback(() => {
    if (socialMedias.length < 5 && selectedNetwork && newUrl) {
      setSocialMedias([...socialMedias, { name: selectedNetwork, url: newUrl }]);
      setSelectedNetwork("");
      setNewUrl("");
    }

    if (socialMedias.length >= 5) {
      toast({
        description: "Veuillez supprimer un réseau social pour en ajouter un nouveau.",
      });
    }

    if (!selectedNetwork) {
      toast({
        description: "Veuillez sélectionner un réseau social.",
      });
    }

    if (!newUrl) {
      toast({
        description: "Veuillez saisir une URL.",
      });
    }
  }, [socialMedias, selectedNetwork, newUrl, toast]);

  const handleRemoveSocialMedia = useCallback(
    (index: number) => {
      const newSocialMedias = socialMedias.filter((_, i) => i !== index);
      setSocialMedias(newSocialMedias);
    },
    [socialMedias],
  );

  const handleUrlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUrl(event.target.value);
  }, []);

  return (
    <fieldset className="mb-4">
      <legend className="text-xs font-medium mb-2">Réseaux sociaux (5 max)</legend>

      {socialMedias.map((socialMedia, index) => (
        <div key={socialMedia.name} className="flex items-center gap-2 mb-2">
          <div className="relative w-full">
            <Icon name={socialMedia.name} />
            <Input
              type="url"
              value={socialMedia.url}
              name={`social_media.${socialMedia.name}`}
              className="ps-8"
              readOnly
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemoveSocialMedia(index)}
            className="text-destructive p-2 cursor-pointer"
          >
            <CircleMinusIcon className="size-4" />
          </button>
        </div>
      ))}

      {socialMedias.length < 5 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={selectedNetwork}
            onValueChange={(value) => setSelectedNetwork(value as SocialMediaName)}
            placeholder="Sélectionner un réseau"
            className="w-full md:max-w-[180px]"
          >
            {SOCIAL_MEDIAS.map((socialMedia) => (
              <SelectItem key={socialMedia.name} value={socialMedia.name}>
                <span className="first-letter:capitalize">{socialMedia.name}</span>
              </SelectItem>
            ))}
          </Select>

          <div className="flex items-center gap-2 flex-1 relative">
            <Input
              type="url"
              placeholder={
                SOCIAL_MEDIAS.find((socialMedia) => socialMedia.name === selectedNetwork)
                  ?.placeholder || "https://www.monentreprise.com"
              }
              value={newUrl}
              onChange={handleUrlChange}
            />
            <button
              type="button"
              onClick={handleAddSocialMedia}
              className="text-primary p-2 cursor-pointer absolute end-0 md:static"
            >
              <CirclePlusIcon className="size-4" />
            </button>
          </div>
        </div>
      )}
    </fieldset>
  );
}
