export async function fetchData() {
    const query = `query {
      transaction(where: { _or: [{ type: {_eq: "up"} }, { type: {_eq: "xp"} }] }, order_by: { createdAt: asc }) {
        type
        amount
        objectId
        object { id type }
        createdAt
        path
      }
      user { id login }
    }`;
  
    return fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({ query })
    }).then(response => response.json())
      .then(({ data }) => data);
  }
  