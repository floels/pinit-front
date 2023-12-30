import _ from "lodash";

export const getPinWithCamelizedKeys = (pin: any) => {
  return {
    id: pin.unique_id,
    imageURL: pin.image_url,
    title: pin.title,
    description: pin.description,
    authorUsername: pin.author.username,
    authorDisplayName: pin.author.display_name,
    authorProfilePictureURL: pin.author.profile_picture_url,
  };
};

export const getPinsWithCamelizedKeys = (pins: any[]) => {
  return pins.map(getPinWithCamelizedKeys);
};

export const withCamelCaseKeys: any = (objectOrArrayOfObjects: any) => {
  if (_.isArray(objectOrArrayOfObjects)) {
    return objectOrArrayOfObjects.map((v) => withCamelCaseKeys(v));
  } else if (
    _.isObject(objectOrArrayOfObjects) &&
    !_.isDate(objectOrArrayOfObjects)
  ) {
    return _.mapKeys(objectOrArrayOfObjects, (v, k) => _.camelCase(k));
  }
  return objectOrArrayOfObjects;
};
