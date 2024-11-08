export const contactTypes = ["work", "home", "personal"];

export const parseSortParams = (query) => {
  const sortBy = query.sortBy || "name";
  const sortOrder = query.sortOrder === "desc" ? -1 : 1;
  return { sortBy, sortOrder };
};

export const parseFilterParams = (query) => {
  const filter = {};

  if (query.type && contactTypes.includes(query.type.toLowerCase())) {
    filter.type = query.type;
  }

  if (query.isFavourite === "true") {
    filter.isFavourite = true;
  }

  if (query.name) {
    filter.name = query.name;
  }

  if (query.number) {
    filter.number = query.number;
  }

  return filter;
};
