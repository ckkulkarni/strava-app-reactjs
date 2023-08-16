Feature: Create Activity Page

    Scenario: User fills out and submits the create activity form
        Given the user is on the Create Activity page
        When the user enters the activity details and submits the form
        Then the user should be redirected to the Activities page
