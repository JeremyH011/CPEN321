describe('New account', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
  }

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
  /*it('should sign out', async () => {
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

  // Check no recommended roommates
  it('should check recommended roommates and see none', async () => {
    await expect(element(by.id('map_screen'))).toBeVisible();

    const recommendedRoomatesButton = element(by.id("recommended_roommates_button"));
    await expect(recommendedRoomatesButton).toBeVisible();
    recommendedRoomatesButton.tap();

    await expect(element(by.id('recommended_roommates_page'))).toBeVisible();

    await expect(element(by.id('recommended_roomate'))).toNotExist();

    const recommendedRoomatesBackButton = element(by.id("recommended_roomates_back_button"));
    await expect(recommendedRoomatesBackButton).toBeVisible();
    recommendedRoomatesBackButton.tap();

    await expect(element(by.id('map_screen'))).toBeVisible();
  });

  const test_search_address = "manitoba";

  // Search for address
  it('should make a search for listings', async () => {
    await expect(element(by.id('map_screen'))).toBeVisible();

    const searchButton = element(by.id("search_button"));
    await expect(searchButton).toBeVisible();
    searchButton.tap();

    await expect(element(by.id('search_page'))).toBeVisible();

    const addressInput = element(by.id('address_input'));
    await expect(addressInput).toBeVisible();
    addressInput.typeText(test_search_address+"\n");

    await expect(element(by.id('address_scrollview'))).toBeVisible();

    const autocompleteItem = element(by.id("location_item")).atIndex(0);
    await expect(autocompleteItem).toBeVisible();
    await autocompleteItem.tap();

    const searchListingsButton = element(by.id('search_listings_button'));
    await expect(searchListingsButton).toBeVisible();
    await searchListingsButton.tap();

    const alert = element(by.text("OK"));

    const startDate = new Date();
    await expect(alert).toBeVisible();
    const endDate = new Date();
    console.log("GOT SEARCH RESULTS IN " + (endDate.getTime() - startDate.getTime()) / 1000 + " SECONDS");

    await alert.tap();
    await expect(element(by.id('map_screen'))).toBeVisible();
  });

  // Check that there are recommended roomates
  it('should check recommended roommates and see some', async () => {
    await expect(element(by.id('map_screen'))).toBeVisible();

    const recommendedRoomatesButton = element(by.id("recommended_roommates_button"));
    await expect(recommendedRoomatesButton).toBeVisible();
    recommendedRoomatesButton.tap();

    await expect(element(by.id('recommended_roommates_page'))).toBeVisible();

    await expect(element(by.id('recommended_roomate')).atIndex(0)).toExist();

    const recommendedRoomatesBackButton = element(by.id("recommended_roomates_back_button"));
    await expect(recommendedRoomatesBackButton).toBeVisible();
    recommendedRoomatesBackButton.tap();

    await expect(element(by.id('map_screen'))).toBeVisible();
  });

  const test_title = "test_title";
  const test_address = "4333";
  const test_price = "1234";

  // Adding a listing
  it('should create a new listing', async () => {
    await expect(element(by.id('map_screen'))).toBeVisible();
    const addListingButton = element(by.id('add_listing_button'));
    await expect(addListingButton).toBeVisible();

    await addListingButton.tap();
    await expect(element(by.id('add_listing_page'))).toBeVisible();

    const titleInput = element(by.id('title_input'));
    const priceInput = element(by.id('price_input'));
    const addressInput = element(by.id('address_input'));

    await expect(titleInput).toBeVisible();
    await expect(priceInput).toBeVisible();
    await expect(addressInput).toBeVisible();

    titleInput.typeText(test_title);
    priceInput.typeText(test_price);
    addressInput.typeText(test_address+"\n");

    await expect(element(by.id('address_scrollview'))).toBeVisible();

    const autocompleteItem = element(by.id("location_item")).atIndex(0);
    await expect(autocompleteItem).toBeVisible();
    await autocompleteItem.tap();

    const createListingButton = element(by.id('create_listing_button'));

    await expect(createListingButton).toBeVisible();
    await createListingButton.tap();

    const alert = element(by.text("OK"));

    const startDate = new Date();
    await expect(alert).toBeVisible();
    const endDate = new Date();
    console.log("GOT NOTIFICATION IN " + (endDate.getTime() - startDate.getTime()) / 1000 + " SECONDS");

    await alert.tap();
    await expect(element(by.id('map_screen'))).toBeVisible();
  });*/
});
