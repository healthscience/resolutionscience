Feature: Welcome UI for electron

  The first time visit with no existing public/private key. No previous network connection.

  Background: The ResolutionScience Application is Open
  Given I have opened the ResolutionScience application

  Scenario: Create a new public/private key
    Given The welcome navigation meun is present
    When  The Account link is pressed
    Then  A public/private key generation completes
