export function parsePopulate(populateParam: string | null) {
  if (!populateParam) return [];

  if (populateParam === '*') {
    // Return common relations. In a more advanced version, we could introspect the model
    return ['author', 'category'];
  }

  return populateParam.split(',').map(item => item.trim());
}

export function getIncludeOptions(populateParam: string | null, associations: any) {
  const requested = parsePopulate(populateParam);
  return requested
    .filter(name => associations[name])
    .map(name => ({ association: name }));
}
