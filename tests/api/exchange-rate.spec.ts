import { test, expect } from '@playwright/test';
import { environmentConstants } from '../../test-data/environment-constant';

test('Verify exchange rates and total currency', async ({ request }) => {
    const response = await request.get(environmentConstants.APIBaseUrl);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const conversion_rates = await responseBody.conversion_rates;

    // Verify total currencies in exchange rates
    expect(Object.keys(conversion_rates).length).toBe(162);

    // Verify GBP present in conversion rates
    expect(Object.keys(conversion_rates)).toContain('GBP');
});