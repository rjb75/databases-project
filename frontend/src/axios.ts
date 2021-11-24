import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BASE_API_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const failedRequest = error.config;

	if (
		error.response.status === 401 &&
		failedRequest.url === '/api/v1/refresh/'
	) {
		return Promise.reject(error);
	}

    if (
      error.response.status === 401
    ) {

        console.log("Failed request is:  ", failedRequest);

      return axiosInstance
        .post("/api/v1/refresh/")
        .then((resp) => {
          console.log("data at interceptor is: ", resp);
          return axiosInstance(failedRequest);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;