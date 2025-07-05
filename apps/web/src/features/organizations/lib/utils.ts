import { Organization, OrganizationTableData } from "../types";

// Transform function to convert API response to table data format
export const transformOrganizationToTableData = (
  org: Organization
): OrganizationTableData => {
  let parsedMetadata = null;

  if (org.metadata) {
    try {
      parsedMetadata = JSON.parse(org.metadata);
    } catch (error) {
      console.warn("Failed to parse organization metadata:", error);
      parsedMetadata = null;
    }
  }

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    logo: org.logo,
    createdAt: org.createdAt,
    metadata: parsedMetadata
  };
};
