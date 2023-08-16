Feature: User Authentication and Redirection

    Scenario: User logs in and gets redirected to Activities screen
        Given the Strava client ID is "mock-id"
        And the Strava client secret is "mock-secret"
        And the user is on the redirect page
        When the user is redirected with code "mock-code"
        Then the access token is set in local storage
