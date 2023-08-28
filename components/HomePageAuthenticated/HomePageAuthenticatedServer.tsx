import { useTranslations } from "next-intl";
import HomePageAuthenticatedClient from "./HomePageAuthenticatedClient";
import { PinSuggestionType } from "./PinSuggestion";
import { getTranslationsObject } from "@/lib/utils/i18n";
import { AccountType } from "@/app/[locale]/page";

type HomePageAuthenticatedServerProps = {
  accounts: AccountType[];
  initialPinSuggestions: PinSuggestionType[];
};

const HomePageAuthenticatedServer = ({
  accounts,
  initialPinSuggestions,
}: HomePageAuthenticatedServerProps) => {
  const componentTranslator = useTranslations("HomePageAuthenticated");
  const componentTranslations = getTranslationsObject(
    "HomePageAuthenticated",
    componentTranslator
  );

  const commonsTranslator = useTranslations("Common");
  const commonsTranslations = getTranslationsObject(
    "Common",
    commonsTranslator
  );

  const labels = {
    component: componentTranslations,
    commons: commonsTranslations,
  };

  return (
    <HomePageAuthenticatedClient
      accounts={accounts}
      initialPinSuggestions={initialPinSuggestions}
      labels={labels}
    />
  );
};

export default HomePageAuthenticatedServer;
