// Import the necessary modules.
import http from "k6/http";
import { check } from "k6";

// Define the login endpoint URL.
const loginEndpointUrl = "http://localhost:3000/posts";

// Define the login request body.
const loginRequestBody = JSON.stringify({
    email: "admin@gmail.com",
    password: "admin",
});
// params
const params = { headers: { 'Content-Type': 'application/json' } }
// Define the test function.
export default function () {
    // Send a POST request to the login endpoint.
    const response = http.post(loginEndpointUrl, loginRequestBody, params);

    // Check the response status code.
    check(response, {
        "status is 200": (r) => r.status === 200,
    });
}
export const options = {
    stages: [
        { duration: '20s', target: 100 },
        { duration: '2s', target: 0 },
        { duration: '20s', target: 1000 },
        { duration: '10s', target: 100 }
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(90) <600', 'p(95) < 700', 'p(99) < 1500']
    }
}
