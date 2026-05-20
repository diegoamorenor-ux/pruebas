import { test, expect } from '@playwright/test';

test('smoke API: obtener post por id', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body).toHaveProperty('id', 1);
  expect(body).toHaveProperty('title');
});

test('smoke API: crear post', async ({ request }) => {
  const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: {
      title: 'qa-smoke',
      body: 'api test',
      userId: 1
    }
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('title', 'qa-smoke');
});