describe('Creating an account', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  const randomEmail = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) +'@test_email.com';
  const password = "123";

  // Signing up for an account with a random email
  it('should sign up and see home screen map', async () => {
    await expect(element(by.id('welcome_screen'))).toBeVisible();
    await element(by.id('signup_button')).tap();
    await expect(element(by.id('signup_screen'))).toBeVisible();

    const emailInput = element(by.id('email_input'));
    const passwordInput = element(by.id('password_input'));

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    emailInput.typeText(randomEmail);
    passwordInput.typeText(password);

    await element(by.id('signup_button')).tap();
    await expect(element(by.id('map_screen'))).toBeVisible();
  });

  // Logging out of a new account
  it('should sign out', async () => {
    await expect(element(by.id('map_screen'))).toBeVisible();
    await element(by.id('profile_tab')).tap();
    await expect(element(by.id('profile_screen'))).toBeVisible();

    const logoutButton = element(by.id('logout_button'));

    await expect(logoutButton).toBeVisible();
    await logoutButton.tap();
    await expect(element(by.id('welcome_screen'))).toBeVisible();
  });

  // Logging into a new account
  it('should log in with newly created account and see home screen map', async () => {
    await expect(element(by.id('welcome_screen'))).toBeVisible();
    await element(by.id('login_button')).tap();
    await expect(element(by.id('login_screen'))).toBeVisible();

    const emailInput = element(by.id('email_input'));
    const passwordInput = element(by.id('password_input'));

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    emailInput.typeText(randomEmail);
    passwordInput.typeText(password);

    await element(by.id('login_button')).tap();
    await expect(element(by.id('map_screen'))).toBeVisible();
  });
});
