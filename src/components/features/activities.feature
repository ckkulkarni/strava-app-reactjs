Feature: Displaying Activities

    Scenario: User sees a list of activities
        Given the user is on the Activities page
        When the user's activities are fetched
        Then the user should see a list of activities

    Scenario: User clicks on "Create Activity" button
        Given the user is on the Activities page
        When the user clicks on the "Create Activity" button
        Then the user should be redirected to the "Create Activity" page
