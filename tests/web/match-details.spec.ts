import { test, expect } from '@playwright/test';
import { ScoreFixtureFootballPage } from '../../pages/ScoreFixtureFootballPage';
import { SearchPage } from '../../pages/SearchPage';
import { environmentConstants } from '../../test-data/environment-constant';
import { commonUtility } from '../../utils/common-utils';
import { ErrorMessages } from '../../test-data/error-messages';

let scoreFixtureFootballPage: ScoreFixtureFootballPage;

test.describe('Match Fixtures', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(environmentConstants.UIBaseUrl);
        scoreFixtureFootballPage = new ScoreFixtureFootballPage(page);
    });

    test("Verify Today's Matches are displayed", async ({ page }) => {
        await scoreFixtureFootballPage.selectToday();
        const todayDate = commonUtility.getDate(new Date());
        expect(page.url()).toBe(environmentConstants.UIBaseUrl + "/" + todayDate);

        const teamNamesHavingMatches = await scoreFixtureFootballPage.getAllTeamNamesWithMatchOnSelectedDate();
        console.log(teamNamesHavingMatches);
        expect(teamNamesHavingMatches).not.toBeNull();
    });

    test("Verify text for no match day", async ({ page }) => {
        const targetDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        await scoreFixtureFootballPage.selectDateInFromCalendar(targetDate);
        expect(page.url()).toBe(environmentConstants.UIBaseUrl + "/" + commonUtility.getDate(targetDate));
        const noFixtureText = await scoreFixtureFootballPage.getNoFixtureText();
        console.log(noFixtureText);
        expect(noFixtureText).toBe(ErrorMessages.NoFixtureMessage);
    });

    test("Verify text for no match day by appending date in url", async ({ page }) => {
        const targetDate = commonUtility.getDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
        await page.goto(environmentConstants.UIBaseUrl + "/" + targetDate);
        const noFixtureText = await scoreFixtureFootballPage.getNoFixtureText();
        console.log(noFixtureText);
        expect(noFixtureText).toBe(ErrorMessages.NoFixtureMessage);
    });

    test("Verify team names after changing date", async ({ page }) => {
        await scoreFixtureFootballPage.selectToday();
        const teamNamesHavingMatches = await scoreFixtureFootballPage.getAllTeamNamesWithMatchOnSelectedDate();

        const targetDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        await scoreFixtureFootballPage.selectDateInFromCalendar(targetDate)
        expect(page.url()).toBe(environmentConstants.UIBaseUrl + "/" + commonUtility.getDate(targetDate));

        await scoreFixtureFootballPage.selectToday(true);
        await page.waitForLoadState('networkidle');
        expect(page.url()).toBe(environmentConstants.UIBaseUrl + "/" + commonUtility.getDate(new Date()));
        const teamNamesAfterNavigatingAway = await scoreFixtureFootballPage.getAllTeamNamesWithMatchOnSelectedDate();
        expect(teamNamesHavingMatches).toStrictEqual(teamNamesAfterNavigatingAway);
    });
});