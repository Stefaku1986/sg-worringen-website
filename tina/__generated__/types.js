export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const NewsPartsFragmentDoc = gql`
    fragment NewsParts on News {
  __typename
  items {
    __typename
    id
    title
    dateDisplay
    date
    text
    images {
      __typename
      src
      alt
    }
  }
}
    `;
export const FussballPartsFragmentDoc = gql`
    fragment FussballParts on Fussball {
  __typename
  seasonEnd
  seasonEndMessage
  clubMatchesWidget
}
    `;
export const NewsDocument = gql`
    query news($relativePath: String!) {
  news(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...NewsParts
  }
}
    ${NewsPartsFragmentDoc}`;
export const NewsConnectionDocument = gql`
    query newsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: NewsFilter) {
  newsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...NewsParts
      }
    }
  }
}
    ${NewsPartsFragmentDoc}`;
export const FussballDocument = gql`
    query fussball($relativePath: String!) {
  fussball(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...FussballParts
  }
}
    ${FussballPartsFragmentDoc}`;
export const FussballConnectionDocument = gql`
    query fussballConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: FussballFilter) {
  fussballConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...FussballParts
      }
    }
  }
}
    ${FussballPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    news(variables, options) {
      return requester(NewsDocument, variables, options);
    },
    newsConnection(variables, options) {
      return requester(NewsConnectionDocument, variables, options);
    },
    fussball(variables, options) {
      return requester(FussballDocument, variables, options);
    },
    fussballConnection(variables, options) {
      return requester(FussballConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
