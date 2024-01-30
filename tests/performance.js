import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  vus: 1000,  
  iterations: 3500,  
  thresholds: { 
    checks: ['rate > 0.9'],
    http_req_duration: ['avg < 2000']
  },
};

const baseURL = 'https://reqres.in';
const userName = 'Rizky Tegar Pratama';
const createJob = 'Principal Tukang Rebahan';
const updateJob = 'Backend Developer';

export default function () {
  const createUserURL = `${baseURL}/api/users`;
  const updateUserURL = `${baseURL}/api/users/2`;
  const createBody = JSON.stringify({
    name: userName,
    job: createJob,
  });
  const updateBody = JSON.stringify({
    name: userName,
    job: updateJob,
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const responses = http.batch([
    ['POST', createUserURL, createBody, { headers }],
    ['PUT', updateUserURL, updateBody, { headers }],
  ]);

  check(responses[0], {
    'Create user response status is 201': (r) => r.status === 201,
    'Create user response name is same with request': (r) => r.json('name') === userName,
    'Create user response job is same with request': (r) => r.json('job') === createJob,
  });

  check(responses[1], {
    'Update user response status is 200': (r) => r.status === 200,
    'Update user response name is same with request': (r) => r.json('name') === userName,
    'Update user response job is same with request': (r) => r.json('job') === updateJob,
  });
}

export function handleSummary(data) {
  return {
    "report.html": htmlReport(data),
  };
}
