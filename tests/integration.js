import http from 'k6/http';
import { check } from 'k6';

const baseURL = 'https://reqres.in';
const userEndpoint = '/api/users';
const userID = 2;

const createUser = {
  name: 'Rizky Tegar Pratama',
  job: 'Principal Tukang Rebahan',
};

const updateUser = {
  name: 'Rizky Tegar Pratama',
  job: 'Backend Developer',
};

export default function () {
  const createUserResponse = http.post(`${baseURL}${userEndpoint}`, JSON.stringify(createUser), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(createUserResponse, {
    'Create user response status is 201': (r) => r.status === 201,
    'Create user response name is same with request': (r) => r.json('name') === createUser.name,
    'Create user response job is same with request': (r) => r.json('job') === createUser.job,
  });

  const updateUserResponse = http.put(`${baseURL}${userEndpoint}/${userID}`, JSON.stringify(updateUser), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(updateUserResponse, {
    'Update user response status is 200': (r) => r.status === 200,
    'Update user response name is same with request': (r) => r.json('name') === updateUser.name,
    'Update user response job is same with request': (r) => r.json('job') === updateUser.job,
  });
}
