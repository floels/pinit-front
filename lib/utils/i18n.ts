import _ from "lodash";
import en from "@/messages/en.json";

export const getTranslationsObject = (
  namespace: string,
  translator: (key: string) => string
) => getTranslationsObjectFromDefaultTranslations(en, namespace, translator);

export const getTranslationsObjectFromDefaultTranslations = (
  defaultTranslations: {},
  namespace: string,
  translator: (key: string) => string
) => {
  const namespacedDefaultTranslations = _.get(defaultTranslations, namespace);

  const translationsObject = {};

  const currentPath = "";

  recursivelyBuildTranslationsObject(
    namespacedDefaultTranslations,
    translator,
    translationsObject,
    currentPath
  );

  return translationsObject;
};

const recursivelyBuildTranslationsObject = (
  defaultTranslations: {},
  translator: (key: string) => string,
  currentTranslationsObject: {},
  currentPath: string
) => {
  const currentPathObjectOrString = currentPath
    ? _.get(defaultTranslations, currentPath)
    : defaultTranslations;

  if (_.isObject(currentPathObjectOrString)) {
    for (let key in currentPathObjectOrString) {
      const oneLevelDownPath =
        currentPath === "" ? key : `${currentPath}.${key}`;
      recursivelyBuildTranslationsObject(
        defaultTranslations,
        translator,
        currentTranslationsObject,
        oneLevelDownPath
      );
    }
  } else {
    const translation = translator(currentPath);
    _.set(currentTranslationsObject, currentPath, translation);
  }
};
