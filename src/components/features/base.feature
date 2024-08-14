Feature: Strava Connect Login and Navigation

    Scenario: User is not logged in and clicks on "Login with Strava" button
        Given I am on the home page
        When I click on "Login With Strava" button
        Then I should be redirected to the Strava OAuth page

    Scenario: User is logged in and opens the app
        Given I am on the home page
        And I am already logged in
        Then I should be redirected to the "Activities" screen

