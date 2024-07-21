import client from "~/utils/http";
export const ENDPOINT = "/consumer";
const consumerSelectAll = async (options = {}) => {
  options = {
    originResponse: true,
    ...options
  };
  return client
    .request({
      key: "consumer",
      ...options
    })
    .get(`${ENDPOINT}/payment/all`);
};

export default {
  consumerSelectAll
};
