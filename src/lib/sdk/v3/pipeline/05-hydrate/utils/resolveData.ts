export function resolveData(rootData: any, path?: string[]): any {
    console.log(rootData,path?.length)
  if (!path || path.length === 0) return rootData;

  return path.reduce((acc, key) => {
    return (acc && acc[key] !== undefined) ? acc[key] : undefined;
  }, rootData.data);
}