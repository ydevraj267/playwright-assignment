import { test, expect } from '@playwright/test';
import { ScoreFixtureFootballPage } from '../../pages/ScoreFixtureFootballPage';
import { SignInPage } from '../../pages/SignInPage';
import { environmentConstants } from '../../test-data/environment-constant';
import { ErrorMessages } from '../../test-data/error-messages';

let scoreFixtureFootballPage: ScoreFixtureFootballPage;
let signInPage: SignInPage;

test.describe('BBC Sign-in Test', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(environmentConstants.UIBaseUrl);
        scoreFixtureFootballPage = new ScoreFixtureFootballPage(page);
        await scoreFixtureFootballPage.clickSignIn();
        signInPage = new SignInPage(page);
    })

    test('Click continue with no email', async ({ page }) => {
        await signInPage.clickContinueButton();
        const errorMessage = await signInPage.getUsernameErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.MissingFieldErrorMessage);
    });

    test('Click continue with unregistered email', async ({ page }) => {
        await signInPage.fillEmailOrUsername('dev.d2671@gmail.com');
        await signInPage.clickContinueButton();
        const errorMessage = await signInPage.getGeneralErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.InvalidUsernameErrorMessage);
    });

    test('Click continue with invalid email format', async ({ page }) => {
        await signInPage.fillEmailOrUsername('@@@@');
        await signInPage.clickContinueButton();
        const errorMessage = await signInPage.getUsernameErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.InvalidUsernameFormatErrorMessage);
    });

    test('Click continue with invalid username format', async ({ page }) => {
        await signInPage.fillEmailOrUsername('dev.d267');
        await signInPage.clickContinueButton();
        const errorMessage = await signInPage.getUsernameErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.InvalidUsernameSpecialCharacterErrorMessage);
    });

    test('Click continue with short username', async ({ page }) => {
        await signInPage.fillEmailOrUsername('a');
        await signInPage.clickContinueButton();
        const errorMessage = await signInPage.getUsernameErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.ShortUsernameErrorMessage);
    });

    test('Click continue with long username', async ({ page }) => {
        await signInPage.fillEmailOrUsername('qqwweerrttyyuuiiooppaassddffgghhjjkkllzzxxccvvbbnnm');
        await signInPage.clickContinueButton();
        const errorMessage = await signInPage.getUsernameErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.LongUsernameErrorMessage);
    });

    test('Sign in with invalid username and blank password', async ({ page }) => {
        await signInPage.fillEmailOrUsername('devraj');
        await signInPage.clickContinueButton();
        await signInPage.clickSignInButton();
        const errorMessage = await signInPage.getPasswordErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.MissingFieldErrorMessage);
        const generalMessage = await signInPage.getGeneralErrorMessge();
        expect(generalMessage).toBe(ErrorMessages.IncorrectUsernameErrorMessage);
    });

    test('Sign in with short password', async ({ page }) => {
        await signInPage.fillEmailOrUsername('devraj');
        await signInPage.clickContinueButton();
        await signInPage.fillPassword('abcdefg');
        await signInPage.clickSignInButton();
        const errorMessage = await signInPage.getPasswordErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.ShortPasswordErrorMessage);
    });

    test('Sign in with long password', async ({ page }) => {
        await signInPage.fillEmailOrUsername('devraj');
        await signInPage.clickContinueButton();
        await signInPage.fillPassword('qqwweerrttyyuuiiooppaassddffgghhjjkkllzzxxccvvbbnnm');
        await signInPage.clickSignInButton();
        const errorMessage = await signInPage.getPasswordErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.LongPasswordErrorMessage);
    });

    test('Sign in with invalid password - only special characters', async ({ page }) => {
        await signInPage.fillEmailOrUsername('devraj');
        await signInPage.clickContinueButton();
        await signInPage.fillPassword('@@@@@@@@@');
        await signInPage.clickSignInButton();
        const errorMessage = await signInPage.getPasswordErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.InvalidPasswordNoLetterErrorMessage);
    });

    test('Sign in with invalid password - only numbers', async ({ page }) => {
        await signInPage.fillEmailOrUsername('devraj');
        await signInPage.clickContinueButton();
        await signInPage.fillPassword('12345678');
        await signInPage.clickSignInButton();
        const errorMessage = await signInPage.getPasswordErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.InvalidPasswordNoLetterErrorMessage);
    });

    test('Sign in with invalid password - only letters', async ({ page }) => {
        await signInPage.fillEmailOrUsername('devraj');
        await signInPage.clickContinueButton();
        await signInPage.fillPassword('qwertyui');
        await signInPage.clickSignInButton();
        const errorMessage = await signInPage.getPasswordErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.InvalidPasswordOnlyLetterErrorMessage);
    });

    test.skip('Sign in with invalid password', async ({ page }) => {
        await signInPage.fillEmailOrUsername('dev.d267@gmail.com');
        await signInPage.clickContinueButton();
        await signInPage.fillPassword('qwerty@123');
        await signInPage.clickSignInButton();
        const errorMessage = await signInPage.getGeneralErrorMessge();
        expect(errorMessage).toBe(ErrorMessages.IncorrectPasswordErrorMessage);
    });
});