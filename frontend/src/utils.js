export function errorToMessages(error) {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors.map(err => err.message);
  } else if (error.message) {
    return [error.message];
  } else {
    return error;
  }
}
