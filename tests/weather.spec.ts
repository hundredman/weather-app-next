// tests/weather.spec.ts

import { test, expect } from '@playwright/test';

// 'Weather App Main Flow' 라는 테스트 그룹을 정의합니다.
test.describe('Weather App Main Flow', () => {

  // 테스트 실행 전, 항상 http://localhost:3000 페이지를 먼저 엽니다.
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  // 'should search for a city and display its weather' 라는 이름의 테스트 케이스입니다.
  test('should search for a city and display its weather', async ({ page }) => {
    // 1. "Search for a city..." placeholder를 가진 입력창을 찾아 'London'을 입력합니다.
    await page.getByPlaceholder('Search for a city...').fill('London');

    // 2. 화면에 나타난 추천 목록 중 'London, United Kingdom' 텍스트를 가진 요소를 클릭합니다.
    // Playwright는 요소가 나타날 때까지 자동으로 기다려줍니다.
    await page.getByText('London, United Kingdom').click();

    // 3. 'London'이라는 제목(heading)이 화면에 나타나는지 확인(expect)합니다.
    // toBeVisible()은 해당 요소가 화면에 보일 때까지 최대 5초(기본값)간 기다립니다.
    await expect(page.getByRole('heading', { name: 'London' })).toBeVisible();

    // 4. 추가로, 'Feels like'라는 텍스트가 화면에 잘 표시되는지도 확인하여
    // 날씨 정보가 성공적으로 렌더링되었는지 검증합니다.
    await expect(page.getByText('Feels like')).toBeVisible();
  });
});