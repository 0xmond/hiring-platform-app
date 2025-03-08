const getMessages = (entity) => {
  return {
    notFound: `${entity} is not found`,
    alreadyExist: `${entity} is already exist`,
    updatedSuccessfully: `${entity} is updated successfully`,
    deletedSuccessfully: `${entity} is deleted successfully`,
    createdSuccessfully: `${entity} is created successfully`,
    archivedSuccessfully: `${entity} is archived successfully`,
  };
};

export const messages = {
  user: getMessages("User"),
  profilePic: getMessages("Profile picture"),
  logo: getMessages("Logo"),
  coverPic: getMessages("Cover picture"),
  company: getMessages("Company"),
  job: getMessages("Job"),
  application: getMessages("Job application"),
};

export const unauthorized = "Unauthorized";

export const updateApplicationStatusResponse = (status) =>
  status
    ? `Application accepted successfully`
    : `Application rejected successfully`;
